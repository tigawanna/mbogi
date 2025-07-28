import { pb } from '@/lib/pb/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, View } from 'react-native';
import {
    Button,
    Card,
    Text,
    TextInput,
    useTheme
} from 'react-native-paper';
import { z } from 'zod';
import { LoadingIndicatorDots } from '@/components/state-screens/LoadingIndicatorDots';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  passwordConfirm: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token?: string;
  onResetComplete: () => void;
  onBackToLogin: () => void;
}

export function ResetPasswordForm({ token, onResetComplete, onBackToLogin }: ResetPasswordFormProps) {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  
  const { control, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || '',
      password: '',
      passwordConfirm: '',
    },
  });

  const resetMutation = useMutation({
    mutationFn: async (data: ResetPasswordFormData) => {
      await pb.from('users').confirmPasswordReset(
        data.token,
        data.password,
        data.passwordConfirm
      );
    },
    onSuccess: () => {
      Alert.alert(
        'Password Reset Successful',
        'Your password has been reset successfully. You can now sign in with your new password.',
        [{ text: 'OK', onPress: onResetComplete }]
      );
    },
    onError: (error: any) => {
      Alert.alert(
        'Reset Failed',
        error?.message || 'Failed to reset password. Please try again or request a new reset link.'
      );
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetMutation.mutate(data);
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Text variant="headlineSmall" style={[styles.title, { color: colors.onSurface }]}>
          Set New Password
        </Text>
        <Text variant="bodyMedium" style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
          Enter your reset token and choose a new password.
        </Text>

        <View style={styles.form}>
          <Controller
            control={control}
            name="token"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Reset Token"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.token}
                autoCapitalize="none"
                style={styles.input}
                left={<TextInput.Icon icon="key" />}
              />
            )}
          />
          {errors.token && (
            <Text variant="bodySmall" style={[styles.errorText, { color: colors.error }]}>
              {errors.token.message}
            </Text>
          )}

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="New Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.password}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
            )}
          />
          {errors.password && (
            <Text variant="bodySmall" style={[styles.errorText, { color: colors.error }]}>
              {errors.password.message}
            </Text>
          )}

          <Controller
            control={control}
            name="passwordConfirm"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Confirm New Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.passwordConfirm}
                secureTextEntry={!showPasswordConfirm}
                autoComplete="new-password"
                style={styles.input}
                left={<TextInput.Icon icon="lock-check" />}
                right={
                  <TextInput.Icon
                    icon={showPasswordConfirm ? "eye-off" : "eye"}
                    onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  />
                }
              />
            )}
          />
          {errors.passwordConfirm && (
            <Text variant="bodySmall" style={[styles.errorText, { color: colors.error }]}>
              {errors.passwordConfirm.message}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            disabled={resetMutation.isPending}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
          >
            {resetMutation.isPending ? (
              <LoadingIndicatorDots />
            ) : (
              'Reset Password'
            )}
          </Button>

          <Button
            mode="text"
            onPress={onBackToLogin}
            style={styles.backButton}
            labelStyle={{ color: colors.primary }}
          >
            Back to Sign In
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    maxWidth: 400,
    width: '100%',
    borderRadius: 16,
  },
  cardContent: {
    padding: 24,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  errorText: {
    marginTop: -12,
    marginBottom: 4,
  },
  submitButton: {
    marginTop: 8,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  backButton: {
    marginTop: 8,
  },
});
