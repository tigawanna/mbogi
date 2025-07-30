import { LoadingIndicatorDots } from '@/components/state-screens/LoadingIndicatorDots';
import { personDetailsQueryOptions } from '@/data/discover/discover-query-options';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Divider, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PersonDetailScreenProps {
  personId: number;
}

export function PersonDetailScreen({ personId }: PersonDetailScreenProps) {
  const { colors } = useTheme();
  const { top } = useSafeAreaInsets();

  const {
    data: person,
    isLoading,
    error,
  } = useQuery({
    ...personDetailsQueryOptions(personId, {
      append_to_response: "movie_credits,tv_credits,recommendations",
    }),
  });

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: top }]}>
        <View style={styles.loadingContainer}>
          <Card style={[styles.statusCard, { backgroundColor: colors.surface }]}>
            <Card.Content style={styles.statusContent}>
              <LoadingIndicatorDots />
              <Text variant="titleMedium" style={[styles.statusTitle, { color: colors.onSurface }]}>
                Loading Person Details
              </Text>
              <Text variant="bodyMedium" style={[styles.statusMessage, { color: colors.onSurfaceVariant }]}>
                Please wait while we fetch the information...
              </Text>
            </Card.Content>
          </Card>
        </View>
      </View>
    );
  }

  if (error || !person) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: top }]}>
        <View style={styles.errorContainer}>
          <Card style={[styles.statusCard, { backgroundColor: colors.surface }]}>
            <Card.Content style={styles.statusContent}>
              <Text variant="displaySmall" style={[styles.statusIcon, { color: colors.error }]}>
                🎭
              </Text>
              <Text variant="titleLarge" style={[styles.statusTitle, { color: colors.error }]}>
                Failed to load person details
              </Text>
              <Text variant="bodyMedium" style={[styles.statusMessage, { color: colors.onSurfaceVariant }]}>
                {error?.message || 'Unknown error occurred'}
              </Text>
              <Button 
                mode="outlined" 
                onPress={() => window.location.reload()}
                style={styles.retryButton}
              >
                Try Again
              </Button>
            </Card.Content>
          </Card>
        </View>
      </View>
    );
  }

  const profileUrl = person.profile_path 
    ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
    : null;

  const formatAge = (): string => {
    if (!person.birthday) return 'Unknown';
    
    const birthDate = new Date(person.birthday);
    const deathDate = person.deathday ? new Date(person.deathday) : new Date();
    const age = deathDate.getFullYear() - birthDate.getFullYear();
    
    if (person.deathday) {
      return `${age} (deceased)`;
    }
    return `${age} years old`;
  };

  const getGenderText = (gender: number): string => {
    switch (gender) {
      case 1: return 'Female';
      case 2: return 'Male';
      case 3: return 'Non-binary';
      default: return 'Not specified';
    }
  };

  // Combine and sort credits by popularity/date
  const movieCredits = person.movie_credits?.cast || [];
  const tvCredits = person.tv_credits?.cast || [];
  const allCredits = [
    ...movieCredits.map(movie => ({ ...movie, type: 'movie' as const })),
    ...tvCredits.map(tv => ({ ...tv, type: 'tv' as const }))
  ].sort((a, b) => b.popularity - a.popularity).slice(0, 10);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: top }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <Card style={[styles.mainCard, { backgroundColor: colors.surface }]}>
          <Card.Content>
            {/* Profile and Basic Info */}
            <View style={styles.headerSection}>
              {profileUrl ? (
                <Image
                  source={{ uri: profileUrl }}
                  style={styles.profile}
                  contentFit="cover"
                  placeholder={require('@/assets/images/poster-placeholder.jpeg')}
                />
              ) : (
                <Image
                  source={require('@/assets/images/poster-placeholder.jpeg')}
                  style={styles.profile}
                  contentFit="cover"
                />
              )}

              <View style={styles.basicInfo}>
                <Text variant="headlineSmall" style={styles.name}>
                  {person.name}
                </Text>

                {person.name !== person.original_name && (
                  <Text 
                    variant="titleMedium" 
                    style={[styles.originalName, { color: colors.onSurfaceVariant }]}
                  >
                    {person.original_name}
                  </Text>
                )}

                <View style={styles.metadata}>
                  <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
                    {person.known_for_department}
                  </Text>
                  <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
                    {getGenderText(person.gender)}
                  </Text>
                  <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
                    {formatAge()}
                  </Text>
                </View>

                {person.place_of_birth && (
                  <Text 
                    variant="bodyMedium" 
                    style={[styles.birthPlace, { color: colors.onSurfaceVariant }]}
                  >
                    📍 {person.place_of_birth}
                  </Text>
                )}
              </View>
            </View>

            {/* Also Known As */}
            {person.also_known_as && person.also_known_as.length > 0 && (
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Also Known As
                </Text>
                <View style={styles.chipContainer}>
                  {person.also_known_as.slice(0, 5).map((name, index) => (
                    <Chip key={index} style={styles.chip} compact>
                      {name}
                    </Chip>
                  ))}
                </View>
              </View>
            )}

            <Divider style={styles.divider} />

            {/* Biography */}
            {person.biography && (
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Biography
                </Text>
                <Text variant="bodyMedium" style={styles.biography}>
                  {person.biography}
                </Text>
              </View>
            )}

            {/* Notable Works */}
            {allCredits.length > 0 && (
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Notable Works
                </Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.creditsScroll}
                >
                  {allCredits.map((credit) => (
                    <View key={`${credit.type}-${credit.id}`} style={styles.creditCard}>
                      <Image
                        source={{
                          uri: credit.poster_path 
                            ? `https://image.tmdb.org/t/p/w200${credit.poster_path}`
                            : require('@/assets/images/poster-placeholder.jpeg')
                        }}
                        style={styles.creditPoster}
                        contentFit="cover"
                        placeholder={require('@/assets/images/poster-placeholder.jpeg')}
                      />
                      <Text 
                        variant="bodySmall" 
                        numberOfLines={2}
                        style={[styles.creditTitle, { color: colors.onSurface }]}
                      >
                        {'title' in credit ? credit.title : credit.name}
                      </Text>
                      <Text 
                        variant="bodySmall" 
                        style={[styles.creditRole, { color: colors.primary }]}
                      >
                        {credit.character || 'Unknown Role'}
                      </Text>
                      <Text 
                        variant="bodySmall" 
                        style={[styles.creditYear, { color: colors.onSurfaceVariant }]}
                      >
                        {'release_date' in credit 
                          ? credit.release_date ? new Date(credit.release_date).getFullYear() : 'TBD'
                          : credit.first_air_date ? new Date(credit.first_air_date).getFullYear() : 'TBD'
                        }
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* External Links */}
            {(person.homepage || person.imdb_id) && (
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  External Links
                </Text>
                {person.homepage && (
                  <Text variant="bodyMedium" style={styles.link}>
                    🌐 {person.homepage}
                  </Text>
                )}
                {person.imdb_id && (
                  <Text variant="bodyMedium" style={styles.link}>
                    🎬 IMDb: {person.imdb_id}
                  </Text>
                )}
              </View>
            )}
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    padding: 16,
  },
  mainCard: {
    elevation: 4,
  },
  headerSection: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  profile: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: 16,
  },
  basicInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  originalName: {
    marginBottom: 8,
  },
  metadata: {
    gap: 4,
    marginBottom: 8,
  },
  birthPlace: {
    marginBottom: 8,
  },
  section: {
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginVertical: 2,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  biography: {
    lineHeight: 20,
  },
  creditsScroll: {
    marginHorizontal: -8,
  },
  creditCard: {
    width: 100,
    marginHorizontal: 8,
  },
  creditPoster: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  creditTitle: {
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 14,
  },
  creditRole: {
    marginBottom: 2,
    fontSize: 12,
  },
  creditYear: {
    fontSize: 12,
  },
  link: {
    marginBottom: 4,
  },
  statusCard: {
    elevation: 4,
    borderRadius: 12,
    marginHorizontal: 20,
  },
  statusContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  statusIcon: {
    marginBottom: 16,
  },
  statusTitle: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  statusMessage: {
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  retryButton: {
    marginTop: 8,
  },
});
