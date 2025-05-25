import { PermissionsAndroid, Platform } from 'react-native';
import { CameraPermissions } from '../types';

export const requestCameraPermissions = async (): Promise<CameraPermissions> => {
  if (Platform.OS !== 'android') {
    return { camera: true, storage: true }; // iOS handles permissions through Info.plist
  }

  try {
    const cameraGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'License Plate Logger needs access to your camera to capture plates.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );

    const storageGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'License Plate Logger needs access to your storage to save plate data.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );

    return {
      camera: cameraGranted === PermissionsAndroid.RESULTS.GRANTED,
      storage: storageGranted === PermissionsAndroid.RESULTS.GRANTED,
    };
  } catch (err) {
    console.warn('Error requesting permissions:', err);
    return { camera: false, storage: false };
  }
};
