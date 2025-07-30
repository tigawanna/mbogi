import { StyleSheet,View } from 'react-native'
import { Text } from 'react-native-paper';

interface PersonDetailScreenProps {
    personId:number
}

export function PersonDetailScreen({personId}: PersonDetailScreenProps) {
  return (
    <View style={styles.container}>
      <Text variant='titleLarge'>PersonDetailScreen</Text>
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
