import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { Camera } from '../components/Camera';

export const CameraScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraContainer: {
    flex: 1,
  },
});
