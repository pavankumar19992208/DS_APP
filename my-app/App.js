import React from 'react';
import { View,StyleSheet } from 'react-native';
import Login from './components/login/Login'; // Adjust the path as necessary

export default function App() {
  return (
    <View style={styles.container}>
      <Login />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
