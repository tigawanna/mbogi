import { viewerQueryOptions } from "@/data/viewer/query-options";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Card,
  Chip,
  Divider,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { LogoutUserButton } from "./LogoutUserButton";





export function ProfileScreenComponent() {
  const { data: user, isPending } = useQuery(viewerQueryOptions());
  const theme = useTheme();

  if (isPending) {
    return (
      <Surface style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            variant="bodyLarge"
            style={[styles.loadingText, { color: theme.colors.onSurface }]}
          >
            Loading your profile...
          </Text>
        </View>
      </Surface>
    );
  }

  if (!user) {
    return (
      <Surface style={styles.container}>
        <View style={styles.loadingContainer}>
          <Surface
            style={[
              styles.iconContainer,
              { backgroundColor: theme.colors.errorContainer },
            ]}
          >
            <MaterialIcons
              name="person-off"
              size={24}
              color={theme.colors.onErrorContainer}
            />
          </Surface>
          <Text
            variant="bodyLarge"
            style={[styles.loadingText, { color: theme.colors.onSurface }]}
          >
            No user data available
          </Text>
        </View>
      </Surface>
    );
  }



  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card with Avatar and Basic Info */}
        <Card
          style={[
            styles.headerCard,
            {  },
          ]}
        >
          <Card.Content style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <Avatar.Image
                size={100}
                source={{
                  uri: user.avatarUrl || "https://via.placeholder.com/100",
                }}
              />
            </View>

            <View style={styles.userInfo}>
              <Text
                variant="headlineMedium"
                style={[
                  styles.userName,
                  { color: theme.colors.onPrimaryContainer },
                ]}
              >
                {user.name || "Anonymous User"}
              </Text>

              <Text
                variant="bodyLarge"
                style={[
                  styles.userEmail,
                  { color: theme.colors.onPrimaryContainer },
                ]}
              >
                {user.emailVisibility ? user.email : "Email hidden"}
              </Text>

              <Chip
                icon={user.verified ? "account-check" : "error"}
                mode="flat"
                style={[
                  styles.statusChip,
                  {
                    backgroundColor: user.verified
                      ? theme.colors.tertiary
                      : theme.colors.error,
                  },
                ]}
                textStyle={{
                  color: user.verified
                    ? theme.colors.onTertiary
                    : theme.colors.onError,
                  fontWeight: "600",
                }}
              >
                {user.verified ? "Verified Account" : "Unverified"}
              </Chip>
            </View>
          </Card.Content>
        </Card>



        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <LogoutUserButton />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:"100%",
    height:"100%"
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
  },
  headerCard: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    borderRadius: 20,
    elevation: 4,
  },
  headerContent: {
    padding: 24,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 16,
    elevation: 8,
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  userName: {
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  userEmail: {
    opacity: 0.8,
    marginBottom: 16,
    textAlign: "center",
  },
  statusChip: {
    borderRadius: 20,
    paddingHorizontal: 4,
  },
  detailsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
  },
  cardTitle: {
    fontWeight: "600",
    marginLeft: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "500",
    opacity: 0.7,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "500",
  },
  logoutContainer: {
    marginHorizontal: 20,
    marginTop: 8,
  },
});
