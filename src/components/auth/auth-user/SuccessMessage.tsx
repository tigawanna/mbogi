import { StyleSheet, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';

interface SuccessMessageProps {
  title: string;
  message: string;
  buttonText: string;
  onButtonPress: () => void;
  icon?: string;
}

export function SuccessMessage({ 
  title, 
  message, 
  buttonText, 
  onButtonPress,
  icon = "check-circle"
}: SuccessMessageProps) {
  const { colors } = useTheme();

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Text style={[styles.icon, { color: colors.primary }]}>✓</Text>
        </View>
        
        <Text variant="headlineSmall" style={[styles.title, { color: colors.onSurface }]}>
          {title}
        </Text>
        
        <Text variant="bodyMedium" style={[styles.message, { color: colors.onSurfaceVariant }]}>
          {message}
        </Text>

        <Button
          mode="contained"
          onPress={onButtonPress}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          {buttonText}
        </Button>
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
    padding: 32,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  button: {
    minWidth: 200,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});