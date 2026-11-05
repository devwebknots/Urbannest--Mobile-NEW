/**
 * Auth View: LoginScreen
 * Pure, dumb UI component. Consumes ONLY the useAuth ViewModel.
 * Contains no direct API clients, no Redux store hooks, and no token handling.
 */

import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import { colors, spacing, typography } from '@/config/theme';
import { useAuth } from '../hooks/useAuth';

export const LoginScreen: React.FC = () => {
  // Consume exclusively through the ViewModel
  const {
    isLoading,
    errorMessage,
    welcomeMessage,
    login,
    clearError,
  } = useAuth();

  // Local transient form presentation state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (text: string) => {
    if (errorMessage) clearError();
    setEmail(text);
  };

  const handlePasswordChange = (text: string) => {
    if (errorMessage) clearError();
    setPassword(text);
  };

  const handleSubmit = async () => {
    await login({ email, password });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>{welcomeMessage}</Text>
            <Text style={styles.subtitle}>
              Sign in to manage your account and access services.
            </Text>
          </View>

          <Card style={styles.formCard}>
            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{errorMessage}</Text>
              </View>
            ) : null}

            <Input
              label="Email Address"
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={handleEmailChange}
              editable={!isLoading}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={handlePasswordChange}
              editable={!isLoading}
            />

            <Button
              title="Sign In"
              onPress={handleSubmit}
              isLoading={isLoading}
              style={styles.submitButton}
            />

            <TouchableOpacity
              style={styles.demoHint}
              onPress={() => {
                setEmail('developer@urbannest.com');
                setPassword('Password123');
              }}
            >
              <Text style={styles.demoHintText}>
                Prefill demo credentials
              </Text>
            </TouchableOpacity>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
  },
  formCard: {
    width: '100%',
  },
  errorBanner: {
    backgroundColor: colors.errorLight,
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  errorBannerText: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  demoHint: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  demoHintText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
});

export default LoginScreen;
