import type { TMDBPerson } from '@/data/discover/discover-zod-schema';
import { Image } from 'expo-image';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

interface SearchPersonCardProps {
    item: TMDBPerson;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // Account for padding and gap

export function SearchPersonCard({ item }: SearchPersonCardProps) {
  const { colors } = useTheme();
  
  const imageUrl = item.profile_path 
    ? `https://image.tmdb.org/t/p/w500${item.profile_path}`
    : null;

  // Get the first known for item for display
  const firstKnownFor = item.known_for && item.known_for.length > 0 
    ? item.known_for[0] 
    : null;

  const knownForTitle = firstKnownFor 
    ? ('title' in firstKnownFor ? firstKnownFor.title : firstKnownFor.name)
    : null;

  return (
    <Card style={[styles.container, { width: cardWidth }]}>
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.profile}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={[styles.profile, styles.placeholderImage, { backgroundColor: colors.surfaceVariant }]}>
            <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
              No Image
            </Text>
          </View>
        )}
      </View>
      
      <Card.Content style={styles.content}>
        <Text 
          variant="titleSmall" 
          numberOfLines={2}
          style={[styles.name, { color: colors.onSurface }]}
        >
          {item.name}
        </Text>
        
        <Text 
          variant="bodySmall" 
          style={[styles.department, { color: colors.onSurfaceVariant }]}
        >
          {item.known_for_department}
        </Text>
        
        {knownForTitle && (
          <Text 
            variant="bodySmall" 
            numberOfLines={1}
            style={[styles.knownFor, { color: colors.primary }]}
          >
            Known for: {knownForTitle}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 2/3, // Profile image aspect ratio
  },
  profile: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 12,
    minHeight: 80,
  },
  name: {
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 4,
  },
  department: {
    marginBottom: 4,
  },
  knownFor: {
    fontWeight: '500',
    marginTop: 4,
  },
});
