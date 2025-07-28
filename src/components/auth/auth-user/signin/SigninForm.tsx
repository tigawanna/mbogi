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

const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onForgotPassword: () => void;
  onSwitchToSignup: () => void;
}

export function LoginForm({ onForgotPassword, onSwitchToSignup }: LoginFormProps) {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return await pb.from('users').authWithPassword(data.email, data.password);
    },
    onSuccess: () => {
      // Success handled by query invalidation
    },
    onError: (error: any) => {
      Alert.alert(
        'Login Failed',
        error?.message || 'Please check your credentials and try again.'
      );
      console.log("Login error:", error.message);
    },
    meta: {
      invalidates: [['viewer']],
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Text variant="headlineSmall" style={[styles.title, { color: colors.onSurface }]}>
          Welcome Back
        </Text>
        <Text variant="bodyMedium" style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
          Sign in to your account
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
                autoComplete="password"
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

          <Button
            mode="text"
            onPress={onForgotPassword}
            style={styles.forgotButton}
            labelStyle={{ color: colors.primary }}
          >
            Forgot Password?
          </Button>

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            disabled={loginMutation.isPending}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
          >
            {loginMutation.isPending ? (
              <LoadingIndicatorDots />
            ) : (
              'Sign In'
            )}
          </Button>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.switchContainer}>
          <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
            Don&apos;t have an account?{' '}
          </Text>
          <Button
            mode="text"
            onPress={onSwitchToSignup}
            compact
            labelStyle={{ color: colors.onPrimary }}
          >
            Sign Up
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
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -8,
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
