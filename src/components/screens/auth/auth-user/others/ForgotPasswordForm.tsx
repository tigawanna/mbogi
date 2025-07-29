import { pb } from '@/lib/pb/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
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

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
  onResetSent: (email: string) => void;
}

export function ForgotPasswordForm({ onBackToLogin, onResetSent }: ForgotPasswordFormProps) {
  const { colors } = useTheme();
  
  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const resetMutation = useMutation({
    mutationFn: async (data: ForgotPasswordFormData) => {
      await pb.from('users').requestPasswordReset(data.email);
      return data.email;
    },
    onSuccess: (email) => {
      onResetSent(email);
    },
    onError: (error: any) => {
      Alert.alert(
        'Reset Failed',
        error?.message || 'Please check your email address and try again.'
      );
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    resetMutation.mutate(data);
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Text variant="headlineSmall" style={[styles.title, { color: colors.onSurface }]}>
          Reset Password
        </Text>
        <Text variant="bodyMedium" style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
          Enter your email address and we&apos;ll send you a link to reset your password.
        </Text>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                style={styles.input}
                left={<TextInput.Icon icon="email" />}
              />
            )}
          />
          {errors.email && (
            <Text variant="bodySmall" style={[styles.errorText, { color: colors.error }]}>
              {errors.email.message}
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
              'Send Reset Link'
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
