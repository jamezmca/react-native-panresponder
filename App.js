import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const colorMap = {}

export default function App() {
  const [array, setArray] = useState({
    data: Array.from(Array(200), (_, i) => {
      colorMap[i] = getRandomColor()
      return i
    })
  })

  return (
    <View style={styles.container}>
      <FlatList data={array.data}
        style={{ width: '100%' }}
        renderItem={({ item }) => (
          <View style={{ padding: 16, backgroundColor: colorMap[item], flexDirection: 'row' }}>
            <View>
              <Text style={{fontSize: 28}}>@</Text>
            </View>
            <Text style={{fontSize: 22, textAlign: 'center', flex: 1}}>{item}</Text>
          </View>)}
        keyExtractor={(item) => "" + item} />
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
