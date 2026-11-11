/**
 * useVoiceNote: record, play back and delete one short voice note
 * (react-native-nitro-sound). Used by "Describe by Voice" on the
 * maintenance request form.
 *  - asks for the microphone (Android runtime prompt; iOS asks on first
 *    record) and explains how to allow it when refused
 *  - records up to MAX_MS with a live timer, then stops by itself
 *  - plays the note back with its progress; deleting asks first
 *  - stops everything when the screen closes
 * Native calls run in the background, so "starting" / "stopping" show a
 * spinner instead of letting the user tap twice.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, PermissionsAndroid, Platform } from 'react-native';
import { createSound, type PlayBackType, type RecordBackType } from 'react-native-nitro-sound';
import type { AppDialogConfig } from '@/components/AppDialog';

/** Longest voice note: 2 minutes */
export const VOICE_NOTE_MAX_MS = 2 * 60 * 1000;

export type VoiceNoteStatus = 'idle' | 'starting' | 'recording' | 'stopping' | 'recorded';

export interface VoiceNote {
  readonly uri: string;
  readonly durationMs: number;
}

/** "1:05" */
export const formatClock = (ms: number) => {
  const total = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};

async function microphoneAllowed(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true; // iOS asks when recording starts
  }
  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
    title: 'Allow the microphone',
    message: 'Urban Nest needs the microphone to record a voice note for your request.',
    buttonPositive: 'Allow',
    buttonNegative: 'Not now',
  });
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export function useVoiceNote(showDialog: (config: AppDialogConfig) => void) {
  // One recorder / player for this form
  const soundRef = useRef<ReturnType<typeof createSound> | null>(null);
  const sound = () => {
    if (!soundRef.current) {
      soundRef.current = createSound();
    }
    return soundRef.current;
  };

  const [status, setStatus] = useState<VoiceNoteStatus>('idle');
  const [elapsedMs, setElapsedMs] = useState(0);
  const [note, setNote] = useState<VoiceNote | null>(null);
  const [playing, setPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  // Latest values for the native callbacks (no stale closures)
  const statusRef = useRef<VoiceNoteStatus>('idle');
  const elapsedRef = useRef(0);
  const setPhase = useCallback((next: VoiceNoteStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const blocked = useCallback(
    () =>
      showDialog({
        tone: 'warning',
        title: 'Microphone is off',
        message: 'Allow microphone access for Urban Nest in Settings to record a voice note.',
        actions: [
          { label: 'Open Settings', variant: 'brand', onPress: () => Linking.openSettings() },
          { label: 'Not now', variant: 'link' },
        ],
      }),
    [showDialog],
  );

  const failed = useCallback(
    (title: string) =>
      showDialog({
        tone: 'warning',
        title,
        message: 'Please try again.',
        actions: [{ label: 'OK' }],
      }),
    [showDialog],
  );

  const stop = useCallback(async () => {
    if (statusRef.current !== 'recording') {
      return;
    }
    setPhase('stopping');
    try {
      const uri = await sound().stopRecorder();
      sound().removeRecordBackListener();
      setNote({ uri, durationMs: elapsedRef.current });
      setPhase('recorded');
    } catch {
      sound().removeRecordBackListener();
      setPhase('idle');
      failed('Could not save the recording');
    }
  }, [failed, setPhase]);

  const start = useCallback(async () => {
    if (statusRef.current !== 'idle') {
      return;
    }
    setPhase('starting');
    try {
      if (!(await microphoneAllowed())) {
        setPhase('idle');
        blocked();
        return;
      }
      elapsedRef.current = 0;
      setElapsedMs(0);
      sound().setSubscriptionDuration(0.25); // seconds between timer updates
      sound().addRecordBackListener((e: RecordBackType) => {
        elapsedRef.current = e.currentPosition;
        setElapsedMs(e.currentPosition);
        if (e.currentPosition >= VOICE_NOTE_MAX_MS) {
          stop();
        }
      });
      await sound().startRecorder();
      setPhase('recording');
    } catch {
      sound().removeRecordBackListener();
      setPhase('idle');
      // iOS: refusing the microphone makes the recorder fail to start
      if (Platform.OS === 'ios') {
        blocked();
      } else {
        failed('Could not start recording');
      }
    }
  }, [blocked, failed, stop, setPhase]);

  const stopPlayback = useCallback(async () => {
    try {
      await sound().stopPlayer();
    } catch {
      // already stopped
    }
    sound().removePlayBackListener();
    sound().removePlaybackEndListener();
    setPlaying(false);
    setPositionMs(0);
  }, []);

  const togglePlay = useCallback(async () => {
    if (!note) {
      return;
    }
    try {
      if (playing) {
        await sound().pausePlayer();
        setPlaying(false);
        return;
      }
      if (positionMs > 0) {
        await sound().resumePlayer();
        setPlaying(true);
        return;
      }
      sound().addPlayBackListener((e: PlayBackType) => setPositionMs(e.currentPosition));
      sound().addPlaybackEndListener(() => {
        stopPlayback();
      });
      await sound().startPlayer(note.uri);
      setPlaying(true);
    } catch {
      stopPlayback();
      failed('Could not play the voice note');
    }
  }, [note, playing, positionMs, stopPlayback, failed]);

  const remove = useCallback(
    () =>
      showDialog({
        tone: 'warning',
        title: 'Delete voice note?',
        message: 'You can record a new one afterwards.',
        actions: [
          {
            label: 'Delete',
            variant: 'danger',
            onPress: () => {
              stopPlayback();
              setNote(null);
              elapsedRef.current = 0;
              setElapsedMs(0);
              setPhase('idle');
            },
          },
          { label: 'Keep', variant: 'link' },
        ],
      }),
    [showDialog, stopPlayback, setPhase],
  );

  // Card tap: start, stop, or play / pause depending on the state
  const press = useCallback(() => {
    if (status === 'idle') {
      start();
    } else if (status === 'recording') {
      stop();
    } else if (status === 'recorded') {
      togglePlay();
    }
  }, [status, start, stop, togglePlay]);

  // Leaving the screen: stop recording / playback and drop listeners
  useEffect(
    () => () => {
      const s = soundRef.current;
      if (!s) {
        return;
      }
      s.removeRecordBackListener();
      s.removePlayBackListener();
      s.removePlaybackEndListener();
      s.stopRecorder().catch(() => undefined);
      s.stopPlayer().catch(() => undefined);
    },
    [],
  );

  return {
    status,
    elapsedMs,
    maxMs: VOICE_NOTE_MAX_MS,
    note,
    playing,
    positionMs,
    press,
    stop,
    remove,
  };
}
