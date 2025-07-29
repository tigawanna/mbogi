import { pb } from '@/lib/pb/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, View } from 'react-native';
import {
    Button,
    Card,
    Divider,
    Text,
    TextInput,
    useTheme
} from 'react-native-paper';
import { z } from 'zod';
import { LoadingIndicatorDots } from '@/components/state-screens/LoadingIndicatorDots';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  passwordConfirm: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onVerificationSent: (email: string) => void;
}

export function SignupForm({ onSwitchToLogin, onVerificationSent }: SignupFormProps) {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  
  const { control, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupFormData) => {
      // Create user account
      const user = await pb.from('users').create({
        name: data.name,
        email: data.email,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
      });
      
      // Send verification email
      await pb.from('users').requestVerification(data.email);
      
      return { user, email: data.email };
    },
    onSuccess: (data) => {
      onVerificationSent(data.email);
    },
    onError: (error: any) => {
      Alert.alert(
        'Signup Failed',
        error?.message || 'Please check your information and try again.'
      );
    },
  });

  const onSubmit = (data: SignupFormData) => {
    signupMutation.mutate(data);
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Text variant="headlineSmall" style={[styles.title, { color: colors.onSurface }]}>
          Create Account
        </Text>
        <Text variant="bodyMedium" style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
          Join the movie community
        </Text>

        <View style={styles.form}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Full Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.name}
                autoCapitalize="words"
                autoComplete="name"
                style={styles.input}
                left={<TextInput.Icon icon="account" />}
              />
            )}
          />
          {errors.name && (
            <Text variant="bodySmall" style={[styles.errorText, { color: colors.error }]}>
              {errors.name.message}
            </Text>
          )}

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

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Password"
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
                label="Confirm Password"
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
            disabled={signupMutation.isPending}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
          >
            {signupMutation.isPending ? (
              <LoadingIndicatorDots />
            ) : (
              'Create Account'
            )}
          </Button>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.switchContainer}>
          <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
            Already have an account?{' '}
          </Text>
          <Button
            mode="text"
            onPress={onSwitchToLogin}
            compact
            labelStyle={{ color: colors.primary }}
          >
            Sign In
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
  divider: {
    marginVertical: 24,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
