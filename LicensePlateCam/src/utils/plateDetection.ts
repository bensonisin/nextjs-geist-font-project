import { createWorker } from 'tesseract.js';
import { LicensePlate } from '../types';

// Using any for now due to incomplete type definitions in tesseract.js
let ocrWorker: any = null;

export const initializeOCR = async (): Promise<void> => {
  try {
    ocrWorker = await createWorker();
    await ocrWorker.load();
    await ocrWorker.loadLanguage('eng');
    await ocrWorker.initialize('eng');
    
    await ocrWorker.setParameters({
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    });

    console.log('OCR initialized successfully');
  } catch (error) {
    console.error('Error initializing OCR:', error);
    throw error;
  }
};

export const detectPlate = async (imageUri: string): Promise<LicensePlate | null> => {
  if (!ocrWorker) {
    throw new Error('OCR not initialized');
  }

  try {
    const { data } = await ocrWorker.recognize(imageUri);
    
    // Clean and validate the detected text
    const text = data.text.replace(/[^A-Z0-9]/g, '').toUpperCase();
    
    // Validate the plate number format
    if (text.length >= 5 && text.length <= 8) {
      return {
        id: Date.now().toString(),
        plateNumber: text,
        timestamp: new Date().toISOString(),
        confidence: data.confidence
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error detecting plate:', error);
    return null;
  }
};

export const cleanupOCR = async (): Promise<void> => {
  if (ocrWorker) {
    try {
      await ocrWorker.terminate();
      ocrWorker = null;
    } catch (error) {
      console.error('Error terminating OCR worker:', error);
    }
  }
};
