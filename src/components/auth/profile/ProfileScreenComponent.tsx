
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, View } from "react-native";
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
import { viewerQueryOptions } from "@/data/viewer/query-options";

export function ProfileScreenComponent() {
  const { data: user, isPending } = useQuery(viewerQueryOptions());
  const theme = useTheme();

  if (isPending) {
    return (
      <Surface
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}>
        <ActivityIndicator size="large" />
        <Text variant="bodyMedium" style={{ marginTop: 16 }}>
          Loading profile...
        </Text>
      </Surface>
    );
  }

  if (!user) {
    return (
      <Surface
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}>
        <MaterialIcons name="person-off" size={48} color={theme.colors.outline} />
        <Text variant="bodyMedium" style={{ marginTop: 16 }}>
          No user data available
        </Text>
      </Surface>
    );
  }
  return (
    <ScrollView
      style={{ width: "100%" }}
      contentContainerStyle={{ height: "100%" }}
      showsVerticalScrollIndicator={false}>
      <Surface style={{ flex: 1, padding: 16 }}>
        {/* Header Section */}
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            marginBottom: 24,
          }}>
          <Avatar.Image
            size={80}
            source={{ uri: user.avatar || "https://via.placeholder.com/80" }}
            style={{ marginRight: 16 }}
          />
          <View
            style={{
              flexDirection: "row",
              gap: 16,
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <View>
              <Text
                variant="headlineSmall"
                style={{
                  fontWeight: "bold",
                  marginBottom: 4,
                }}>
                {user.name || "Anonymous User"}
              </Text>
              <Text
                variant="bodyMedium"
                style={[{ marginBottom: 8 }, { color: theme.colors.onSurfaceVariant }]}>
                {user.emailVisibility ? user.email : "Email hidden"}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
              }}>
              <Chip
                icon={user.verified ? "check-circle" : "alert-circle"}
                mode="outlined"
                compact
                style={[
                  {
                    marginRight: 8,
                    marginBottom: 4,
                  },
                  {
                    backgroundColor: user.verified
                      ? theme.colors.primaryContainer
                      : theme.colors.errorContainer,
                  },
                ]}>
                {user.verified ? "Verified" : "Unverified"}
              </Chip>
            </View>
          </View>
        </View>

        <Divider style={{ marginBottom: 16 }} />

        {/* Profile Details */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <Text
              variant="titleMedium"
              style={{
                fontWeight: "bold",
                marginBottom: 16,
              }}>
              Profile Details
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 16,
              }}>
              <MaterialIcons name="badge" size={20} color={theme.colors.primary} />
              <View
                style={{
                  flex: 1,
                  marginLeft: 12,
                }}>
                <Text
                  variant="labelMedium"
                  style={{
                    opacity: 0.7,
                    marginBottom: 2,
                  }}>
                  User ID
                </Text>
                <Text variant="bodyMedium" selectable>
                  {user.id}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 16,
              }}>
              <MaterialIcons name="email" size={20} color={theme.colors.primary} />
              <View
                style={{
                  flex: 1,
                  marginLeft: 12,
                }}>
                <Text
                  variant="labelMedium"
                  style={{
                    opacity: 0.7,
                    marginBottom: 2,
                  }}>
                  Email
                </Text>
                <Text variant="bodyMedium" selectable>
                  {user.emailVisibility ? user.email : "Hidden for privacy"}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 16,
              }}>
              <MaterialIcons name="visibility" size={20} color={theme.colors.primary} />
              <View
                style={{
                  flex: 1,
                  marginLeft: 12,
                }}>
                <Text
                  variant="labelMedium"
                  style={{
                    opacity: 0.7,
                    marginBottom: 2,
                  }}>
                  Email Visibility
                </Text>
                <Text variant="bodyMedium">{user.emailVisibility ? "Public" : "Private"}</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 16,
              }}>
              <MaterialIcons name="key" size={20} color={theme.colors.primary} />
              <View
                style={{
                  flex: 1,
                  marginLeft: 12,
                }}>
                <Text
                  variant="labelMedium"
                  style={{
                    opacity: 0.7,
                    marginBottom: 2,
                  }}>
                  Token Key
                </Text>
                <Text variant="bodyMedium" selectable numberOfLines={1}>
                  {user.tokenKey ? `${user.tokenKey.substring(0, 8)}...` : "Not available"}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        <LogoutUserButton/>
      </Surface>
    </ScrollView>
  );
}
