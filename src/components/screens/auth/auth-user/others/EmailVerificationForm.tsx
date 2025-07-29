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

const verificationSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

interface EmailVerificationFormProps {
  email: string;
  token?: string;
  onVerificationComplete: () => void;
  onBackToLogin: () => void;
}

export function EmailVerificationForm({ 
  email, 
  token, 
  onVerificationComplete, 
  onBackToLogin 
}: EmailVerificationFormProps) {
  const { colors } = useTheme();
  
  const { control, handleSubmit, formState: { errors } } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      token: token || '',
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: VerificationFormData) => {
      await pb.from('users').confirmVerification(data.token);
    },
    onSuccess: () => {
      Alert.alert(
        'Email Verified!',
        'Your email has been successfully verified. You can now sign in to your account.',
        [{ text: 'OK', onPress: onVerificationComplete }]
      );
    },
    onError: (error: any) => {
      Alert.alert(
        'Verification Failed',
        error?.message || 'Invalid or expired verification token. Please request a new verification email.'
      );
    },
  });

  const resendMutation = useMutation({
    mutationFn: async () => {
      await pb.from('users').requestVerification(email);
    },
    onSuccess: () => {
      Alert.alert(
        'Verification Email Sent',
        'A new verification email has been sent to your email address.'
      );
    },
    onError: (error: any) => {
      Alert.alert(
        'Failed to Send Email',
        error?.message || 'Failed to send verification email. Please try again later.'
      );
    },
  });

  const onSubmit = (data: VerificationFormData) => {
    verifyMutation.mutate(data);
  };

  const handleResend = () => {
    resendMutation.mutate();
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Text variant="headlineSmall" style={[styles.title, { color: colors.onSurface }]}>
          Verify Your Email
        </Text>
        <Text variant="bodyMedium" style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
          We&apos;ve sent a verification email to{' '}
          <Text style={{ fontWeight: 'bold' }}>{email}</Text>
          {'\n\n'}
          Please check your email and enter the verification token below.
        </Text>

        <View style={styles.form}>
          <Controller
            control={control}
            name="token"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Verification Token"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.token}
                autoCapitalize="none"
                style={styles.input}
                left={<TextInput.Icon icon="shield-check" />}
              />
            )}
          />
          {errors.token && (
            <Text variant="bodySmall" style={[styles.errorText, { color: colors.error }]}>
              {errors.token.message}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            disabled={verifyMutation.isPending}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
          >
            {verifyMutation.isPending ? (
              <LoadingIndicatorDots />
            ) : (
              'Verify Email'
            )}
          </Button>

          <View style={styles.resendContainer}>
            <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
              Didn&apos;t receive the email?{' '}
            </Text>
            <Button
              mode="text"
              onPress={handleResend}
              disabled={resendMutation.isPending}
              compact
              labelStyle={{ color: colors.primary }}
            >
              {resendMutation.isPending ? 'Sending...' : 'Resend'}
            </Button>
          </View>

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
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  backButton: {
    marginTop: 8,
  },
});
