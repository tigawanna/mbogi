import { TMDBSearchResponse } from '@/data/discover/discover-zod-schema';
import { StyleSheet,View } from 'react-native'
import { Text } from 'react-native-paper';

type ResultItem = TMDBSearchResponse["results"][number];

interface DiscoverCardActionProps {
type: "movies" | "tv" | "person";
item: ResultItem;
}

export function DiscoverCardAction({ type, item }: DiscoverCardActionProps) {
   if(item.media_type === "person"){
    return
   } 
  return (
    <View style={styles.container}>
      <Text variant='titleLarge'>DiscoverCardAction</Text>
      {/* implement add to watchlist here */}
    </View>
  );
}
const styles = StyleSheet.create({
container:{
  flex:1,
  height:'100%',
   width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}
})
