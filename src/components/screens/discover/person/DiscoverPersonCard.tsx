import type { TMDBPerson } from "@/data/discover/discover-zod-schema";
import { ViewMode } from "@/store/view-preferences-store";
import { Image } from "expo-image";
import { Dimensions, StyleSheet, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

interface DiscoverPersonCardProps {
  item: TMDBPerson;
  viewMode?: ViewMode;
}

const { width } = Dimensions.get("window");
const gridCardWidth = (width - 48) / 2; // Account for padding and gap
const listCardWidth = width - 32; // Account for horizontal padding

export function DiscoverPersonCard({ item, viewMode = "grid" }: DiscoverPersonCardProps) {
  const { colors } = useTheme();

  const imageUrl = item.profile_path ? `https://image.tmdb.org/t/p/w500${item.profile_path}` : null;

  // Get the first known for item for display
  const firstKnownFor = item.known_for && item.known_for.length > 0 ? item.known_for[0] : null;

  const knownForTitle = firstKnownFor
    ? "title" in firstKnownFor
      ? firstKnownFor.title
      : firstKnownFor.name
    : null;

  const isGridView = viewMode === "grid";
  const cardWidth = isGridView ? gridCardWidth : listCardWidth;

  return (
    <Card style={[isGridView ? styles.gridContainer : styles.listContainer, { width: cardWidth }]}>
      {isGridView ? (
        // Grid Layout (existing design)
        <>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: imageUrl ? imageUrl : require("@/assets/images/poster-placeholder.jpeg"),
              }}
              style={styles.profile}
              contentFit="cover"
              transition={200}
              placeholder={require("@/assets/images/poster-placeholder.jpeg")}
            />
          </View>

          <Card.Content style={styles.gridContent}>
            <Text
              variant="titleSmall"
              numberOfLines={2}
              style={[styles.name, { color: colors.onSurface }]}>
              {item.name}
            </Text>

            <Text
              variant="bodySmall"
              style={[styles.department, { color: colors.onSurfaceVariant }]}>
              {item.known_for_department}
            </Text>

            {knownForTitle && (
              <Text
                variant="bodySmall"
                numberOfLines={1}
                style={[styles.knownFor, { color: colors.primary }]}>
                Known for: {knownForTitle}
              </Text>
            )}
          </Card.Content>
        </>
      ) : (
        // List Layout (horizontal)
        <View style={styles.listContent}>
          <View style={styles.listImageContainer}>
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={styles.listProfile}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <View
                style={[
                  styles.listProfile,
                  styles.placeholderImage,
                  { backgroundColor: colors.surfaceVariant },
                ]}>
                <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                  No Image
                </Text>
              </View>
            )}
          </View>

          <View style={styles.listTextContent}>
            <Text
              variant="titleMedium"
              numberOfLines={2}
              style={[styles.listName, { color: colors.onSurface }]}>
              {item.name}
            </Text>

            <Text
              variant="bodyMedium"
              style={[styles.listDepartment, { color: colors.onSurfaceVariant }]}>
              {item.known_for_department}
            </Text>

            {knownForTitle && (
              <Text
                variant="bodySmall"
                numberOfLines={2}
                style={[styles.listKnownFor, { color: colors.primary }]}>
                Known for: {knownForTitle}
              </Text>
            )}

            {item.known_for && item.known_for.length > 1 && (
              <Text
                variant="bodySmall"
                style={[styles.listAdditional, { color: colors.onSurfaceVariant }]}>
                +{item.known_for.length - 1} more
              </Text>
            )}
          </View>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  // Grid styles (existing)
  gridContainer: {
    marginBottom: 8,
    elevation: 2,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 2 / 3, // Profile image aspect ratio
  },
  profile: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  gridContent: {
    padding: 12,
    minHeight: 80,
  },
  name: {
    fontWeight: "600",
    lineHeight: 18,
    marginBottom: 4,
  },
  department: {
    marginBottom: 4,
  },
  knownFor: {
    fontWeight: "500",
    marginTop: 4,
  },

  // List styles (new)
  listContainer: {
    marginBottom: 12,
    elevation: 2,
  },
  listContent: {
    flexDirection: "row",
    padding: 16,
  },
  listImageContainer: {
    width: 80,
    height: 120,
    marginRight: 16,
  },
  listProfile: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  listTextContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  listName: {
    fontWeight: "600",
    marginBottom: 8,
  },
  listDepartment: {
    fontWeight: "500",
    marginBottom: 8,
  },
  listKnownFor: {
    fontWeight: "500",
    marginBottom: 4,
    lineHeight: 18,
  },
  listAdditional: {
    marginTop: 4,
    fontStyle: "italic",
  },
});
