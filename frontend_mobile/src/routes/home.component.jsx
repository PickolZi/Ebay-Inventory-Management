import { useState, useEffect } from 'react';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import fetchFromFlaskAPIUsingGet from '../utils/fetch-from-flask-api';


const Home = ()  => {
    const [data, setData] = useState(123);

    useEffect(() => {
        const getData = async () => {
            const response = await fetchFromFlaskAPIUsingGet("/api/getItem/364532113079");
            console.log(response);
            setData(response.title)
        }
        getData();
    },[]);

  return (
    <View style={styles.container}>
      <Text>Welcome to my react app</Text>
      <Text>{data}</Text>
      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Home;