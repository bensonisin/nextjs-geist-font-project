declare module 'react-native-vector-icons/MaterialCommunityIcons';
declare module 'react-native-vision-camera' {
  import { Component } from 'react';
  
  export interface CameraDevice {
    id: string;
    name: string;
    position: 'front' | 'back';
    hasFlash: boolean;
  }

  export interface CameraProps {
    device: CameraDevice;
    isActive: boolean;
    photo: boolean;
    style?: any;
    ref?: any;
  }

  export class Camera extends Component<CameraProps> {
    takeSnapshot(options?: any): Promise<{ path: string }>;
  }

  export function useCameraDevices(): CameraDevice[];
}
