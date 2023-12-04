import { StatusBar } from 'expo-status-bar';
import { Text, SafeAreaView, StyleSheet, View, ActivityIndicator, FlatList } from 'react-native';
import SearchForm from './src/components/SearchForm';
import FlightOptionItem from './src/components/FlightList';
import { LinearGradient} from 'expo-linear-gradient';
// import dummyData from './data';
import { useState } from 'react';
import { searchFlights } from './src/services/api';

//const option1 = data[0];

export default function App() {

  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(false)

  const onSearch = async (data) => {
    setLoading(true);
    setItems([]);

    // console.warn(data);
    // get items from the backend
    const response = await searchFlights(data);
    // console.log(response);

    // then set them in state:
    // setItems(dummyData);
    setItems(response.data);

    setLoading(false);
  }

  return (
    <LinearGradient colors={['white', '#E0EFFF']} style={styles.container}
    //search for linear gradient react native
    //run "npx expo install expo-linear-gradient"
    //replace View with LinearGradient
    //for backgrounds
    >
      <SafeAreaView>
        <SearchForm onSearch={onSearch}/>

        {loading && (
          <View>
            <ActivityIndicator/>
            <Text>Searching for the best prices...</Text>
          </View>
        )}

        <FlatList
          //contentContainerStyle={{ flex: 1 }}
          data = {items}
          renderItem={({item}) => <FlightOptionItem flight={item} /> }
          showsVerticalScrollIndicator={false}
        />

      </SafeAreaView>

      <StatusBar style="auto" />
      
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    justifyContent: 'center',
  },
});
