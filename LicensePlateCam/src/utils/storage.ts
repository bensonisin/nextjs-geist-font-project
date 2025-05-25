import RNFS from 'react-native-fs';
import { LicensePlate } from '../types';

const PLATES_FILE = `${RNFS.DocumentDirectoryPath}/license_plates.txt`;

export const savePlate = async (plate: LicensePlate): Promise<void> => {
  try {
    let existingData: LicensePlate[] = [];
    
    // Read existing data if file exists
    if (await RNFS.exists(PLATES_FILE)) {
      const content = await RNFS.readFile(PLATES_FILE, 'utf8');
      existingData = JSON.parse(content);
    }

    // Add new plate
    existingData.push(plate);

    // Save back to file
    await RNFS.writeFile(
      PLATES_FILE,
      JSON.stringify(existingData, null, 2),
      'utf8'
    );
  } catch (error) {
    console.error('Error saving plate:', error);
    throw error;
  }
};

export const getPlates = async (): Promise<LicensePlate[]> => {
  try {
    if (!(await RNFS.exists(PLATES_FILE))) {
      return [];
    }

    const content = await RNFS.readFile(PLATES_FILE, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading plates:', error);
    return [];
  }
};

export const clearPlates = async (): Promise<void> => {
  try {
    if (await RNFS.exists(PLATES_FILE)) {
      await RNFS.unlink(PLATES_FILE);
    }
  } catch (error) {
    console.error('Error clearing plates:', error);
    throw error;
  }
};
