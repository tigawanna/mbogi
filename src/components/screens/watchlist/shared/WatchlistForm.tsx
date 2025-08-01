import { StyleSheet,View } from 'react-native'
import { Text } from 'react-native-paper';


export function WatchlistForm() {
  return (
    <View style={styles.container}>
      <Text variant='titleLarge'>WatchlistForm</Text>
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
