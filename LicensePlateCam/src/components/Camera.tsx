import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Camera as VisionCamera, useCameraDevices, CameraDevice } from 'react-native-vision-camera';
import { initializeOCR, detectPlate, cleanupOCR } from '../utils/plateDetection';
import { savePlate } from '../utils/storage';
import { requestCameraPermissions } from '../utils/permissions';

export const Camera: React.FC = () => {
  const camera = useRef<VisionCamera>(null);
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const devices = useCameraDevices();
  const device = devices.find((d: CameraDevice) => d.position === 'back');

  useEffect(() => {
    setupCamera();
    return () => {
      cleanupOCR();
    };
  }, []);

  const setupCamera = async () => {
    try {
      const permissions = await requestCameraPermissions();
      if (permissions.camera && permissions.storage) {
        await initializeOCR();
        setIsReady(true);
      }
    } catch (error) {
      console.error('Error setting up camera:', error);
    }
  };

  const captureAndProcess = async () => {
    if (camera.current && !isProcessing) {
      setIsProcessing(true);
      try {
        const photo = await camera.current.takeSnapshot();

        const plate = await detectPlate(photo.path);
        if (plate) {
          await savePlate(plate);
          console.log('Saved plate:', plate.plateNumber);
        }
      } catch (error) {
        console.error('Error capturing photo:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (!device || !isReady) {
    return (
      <View style={styles.container}>
        <Text>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VisionCamera
        ref={camera}
        device={device}
        isActive={true}
        photo={true}
        style={StyleSheet.absoluteFill}
      />
      <TouchableOpacity
        style={[styles.captureButton, isProcessing && styles.processingButton]}
        onPress={captureAndProcess}
        disabled={isProcessing}
      >
        <Text style={styles.captureText}>
          {isProcessing ? 'Processing...' : 'Capture'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  captureButton: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  processingButton: {
    backgroundColor: '#cccccc',
  },
  captureText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});
