import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Divider, Surface, Text, useTheme } from "react-native-paper";
import { SuccessMessage } from "../others/SuccessMessage";
import { SignupForm } from "./SignupForm";
import { EmailVerificationForm } from "../others/EmailVerificationForm";
import { OauthLogin } from "../signin/OauthLogin";

type SignupState = 
  | 'signup'
  | 'verificationSent'
  | 'emailVerification';

export function SignupScreen() {
  const { colors } = useTheme();
  const [signupState, setSignupState] = useState<SignupState>('signup');
  const [email, setEmail] = useState('');

  const handleVerificationSent = (userEmail: string) => {
    setEmail(userEmail);
    setSignupState('verificationSent');
  };

  const handleBackToSignup = () => {
    setSignupState('signup');
    setEmail('');
  };

  const handleVerificationComplete = () => {
    // Navigate to login or main app
    setSignupState('signup');
    setEmail('');
  };

  const handleProceedToVerification = () => {
    setSignupState('emailVerification');
  };

  const renderContent = () => {
    switch (signupState) {
      case 'verificationSent':
        return (
          <SuccessMessage
            title="Account Created!"
            message={`We've sent a verification email to ${email}. Please check your email and verify your account to complete the signup process.`}
            buttonText="Verify Email"
            onButtonPress={handleProceedToVerification}
          />
        );

      case 'emailVerification':
        return (
          <EmailVerificationForm
            email={email}
            onVerificationComplete={handleVerificationComplete}
            onBackToLogin={handleBackToSignup}
          />
        );

      default:
        return (
          <View style={styles.authContainer}>
            <SignupForm
              onSwitchToLogin={() => {}} // This will be handled by navigation
              onVerificationSent={handleVerificationSent}
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
