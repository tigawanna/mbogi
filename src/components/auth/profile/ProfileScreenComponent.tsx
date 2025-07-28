import { viewerQueryOptions } from "@/data/viewer/query-options";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
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

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
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

  const detailItems = [
    {
      icon: "badge",
      label: "User ID",
      value: user.id,
      selectable: true,
    },
    {
      icon: "email",
      label: "Email Address",
      value: user.emailVisibility ? user.email : "Hidden for privacy",
      selectable: user.emailVisibility,
    },
    {
      icon: "visibility",
      label: "Email Visibility",
      value: user.emailVisibility ? "Public" : "Private",
      selectable: false,
    },
    {
      icon: "key",
      label: "Token Key",
      value: user.tokenKey
        ? `${user.tokenKey.substring(0, 12)}...`
        : "Not available",
      selectable: true,
    },
  ];

  return (
    <Surface style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card with Avatar and Basic Info */}
        <Card
          style={[
            styles.headerCard,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
        >
          <Card.Content style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <Avatar.Image
                size={100}
                source={{
                  uri: user.avatar || "https://via.placeholder.com/100",
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
                icon={user.verified ? "verified" : "error"}
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

        {/* Profile Details Card */}
        <Card style={styles.detailsCard}>
          <Card.Content style={{ padding: 20 }}>
            <View style={styles.cardHeader}>
              <Surface
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.colors.secondaryContainer },
                ]}
              >
                <MaterialIcons
                  name="info"
                  size={20}
                  color={theme.colors.onSecondaryContainer}
                />
              </Surface>
              <Text
                variant="titleLarge"
                style={[styles.cardTitle, { color: theme.colors.onSurface }]}
              >
                Profile Details
              </Text>
            </View>

            <Divider style={{ marginBottom: 16, opacity: 0.3 }} />

            {detailItems.map((item, index) => (
              <Surface
                key={index}
                style={[
                  styles.detailRow,
                  { backgroundColor: theme.colors.surfaceVariant + "40" },
                ]}
              >
                <Surface
                  style={[
                    styles.iconContainer,
                    { backgroundColor: theme.colors.primary + "20" },
                  ]}
                >
                  <MaterialIcons
                    name={item.icon as any}
                    size={18}
                    color={theme.colors.primary}
                  />
                </Surface>

                <View style={styles.detailContent}>
                  <Text
                    style={[
                      styles.detailLabel,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text
                    variant="bodyLarge"
                    style={[
                      styles.detailValue,
                      { color: theme.colors.onSurface },
                    ]}
                    selectable={item.selectable}
                    numberOfLines={item.label === "Token Key" ? 1 : undefined}
                  >
                    {item.value}
                  </Text>
                </View>
              </Surface>
            ))}
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <LogoutUserButton />
        </View>
      </ScrollView>
    </Surface>
  );
}
