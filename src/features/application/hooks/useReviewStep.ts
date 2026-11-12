/**
 * useReviewStep: state for step 4 of the rental application, "Review,
 * Consent & Submit" (used inside useRentalApplication): the consent
 * checkboxes and the typed signature. `check(legalName)` runs on Submit:
 * every required consent ticked and the signature matching the
 * applicant's legal name (first + last; middle name optional; any case).
 */

import { useCallback, useState } from 'react';
import type { AppDialogConfig } from '@/components/AppDialog';
import { APPLICATION_CONSENTS } from '../constants';

const normalise = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

export function useReviewStep(showDialog: (config: AppDialogConfig) => void) {
  const [consents, setConsents] = useState<Set<string>>(() => new Set());
  const [signature, setSignature] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const toggleConsent = useCallback((id: string) => {
    setConsents(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const missingConsents = APPLICATION_CONSENTS.filter(c => c.required && !consents.has(c.id));

  /** Accepts "First Last" or "First Middle Last" */
  const signatureMatches = (first: string, middle: string, last: string) => {
    const typed = normalise(signature);
    const full = normalise([first, middle, last].filter(Boolean).join(' '));
    const short = normalise([first, last].filter(Boolean).join(' '));
    return typed.length > 0 && (typed === full || typed === short);
  };

  const signatureError = (first: string, middle: string, last: string) => {
    if (!showErrors) {
      return undefined;
    }
    if (!signature.trim()) {
      return 'Required';
    }
    return signatureMatches(first, middle, last)
      ? undefined
      : `Must match your legal name (${[first, last].filter(Boolean).join(' ')})`;
  };

  const check = (first: string, middle: string, last: string): boolean => {
    const problems: string[] = [];
    if (missingConsents.length > 0) {
      problems.push(
        missingConsents.length === 1
          ? 'tick the required consent'
          : `tick the ${missingConsents.length} required consents`,
      );
    }
    if (!signatureMatches(first, middle, last)) {
      problems.push('type your full legal name to sign');
    }
    if (problems.length === 0) {
      return true;
    }
    setShowErrors(true);
    showDialog({
      tone: 'info',
      title: 'Almost there',
      message: `Please ${problems.join(' and ')} before you submit.`,
      actions: [{ label: 'OK', variant: 'brand' }],
    });
    return false;
  };

  return {
    consents,
    toggleConsent,
    consentItems: APPLICATION_CONSENTS,
    showErrors,
    signature,
    setSignature,
    signatureError,
    check,
  };
}

export type ReviewStepModel = ReturnType<typeof useReviewStep>;
