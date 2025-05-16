import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import AppNavigator from './src/navigation';
import { PetsProvider } from './src/context/PetsContext';

export default function App() {
  return (
    <PetsProvider>
      <View style={{ flex: 1 }}>
        <AppNavigator />
        <StatusBar style="auto" />
      </View>
    </PetsProvider>
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