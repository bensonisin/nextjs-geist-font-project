export interface LicensePlate {
  id: string;
  plateNumber: string;
  timestamp: string;
  confidence: number;
}

export interface CameraPermissions {
  camera: boolean;
  storage: boolean;
}
