import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Divider, Surface, Text, useTheme } from "react-native-paper";
import { EmailVerificationForm } from "./EmailVerificationForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { LoginForm } from "./LoginForm";
import { OauthLogin } from "./OauthLogin";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { SuccessMessage } from "./SuccessMessage";

type AuthState = 
  | 'login'
  | 'forgotPassword'
  | 'resetPassword'
  | 'emailVerification'
  | 'resetSent'
  | 'verificationSent';

export function LoginScreenComponent() {
  const { colors } = useTheme();
  const [authState, setAuthState] = useState<AuthState>('login');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleForgotPassword = () => {
    setAuthState('forgotPassword');
  };

  const handleResetSent = (userEmail: string) => {
    setEmail(userEmail);
    setAuthState('resetSent');
  };

  // const handleVerificationSent = (userEmail: string) => {
  //   setEmail(userEmail);
  //   setAuthState('verificationSent');
  // };

  const handleBackToLogin = () => {
    setAuthState('login');
    setEmail('');
    setResetToken('');
  };

  const handleResetComplete = () => {
    setAuthState('login');
    setEmail('');
    setResetToken('');
  };

  const handleVerificationComplete = () => {
    setAuthState('login');
    setEmail('');
  };

  const renderContent = () => {
    switch (authState) {
      case 'forgotPassword':
        return (
          <ForgotPasswordForm
            onBackToLogin={handleBackToLogin}
            onResetSent={handleResetSent}
          />
        );

      case 'resetSent':
        return (
          <SuccessMessage
            title="Reset Link Sent"
            message={`We've sent a password reset link to ${email}. Please check your email and follow the instructions to reset your password.`}
            buttonText="Back to Sign In"
            onButtonPress={handleBackToLogin}
          />
        );

      case 'resetPassword':
        return (
          <ResetPasswordForm
            token={resetToken}
            onResetComplete={handleResetComplete}
            onBackToLogin={handleBackToLogin}
          />
        );

      case 'emailVerification':
        return (
          <EmailVerificationForm
            email={email}
            onVerificationComplete={handleVerificationComplete}
            onBackToLogin={handleBackToLogin}
          />
        );

      case 'verificationSent':
        return (
          <EmailVerificationForm
            email={email}
            onVerificationComplete={handleVerificationComplete}
            onBackToLogin={handleBackToLogin}
          />
        );

      default:
        return (
          <View style={styles.authContainer}>
            <LoginForm
              onForgotPassword={handleForgotPassword}
              onSwitchToSignup={() => {}} // This will be handled by navigation
            />
            
            <View style={styles.dividerContainer}>
              <Divider style={styles.divider} />
              <Text variant="bodySmall" style={[styles.dividerText, { color: colors.onSurfaceVariant }]}>
                OR
              </Text>
              <Divider style={styles.divider} />
            </View>

            <OauthLogin />
          </View>
        );
    }
  };

  return (
    <Surface style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderContent()}
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    minHeight: '100%',
  },
  authContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  divider: {
    flex: 1,
  },
  dividerText: {
    paddingHorizontal: 8,
    opacity: 0.7,
  },
});
