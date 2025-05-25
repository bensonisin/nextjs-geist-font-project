import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getPlates, clearPlates } from '../utils/storage';
import { LicensePlate } from '../types';

export const LogsScreen: React.FC = () => {
  const [plates, setPlates] = useState<LicensePlate[]>([]);

  useEffect(() => {
    loadPlates();
  }, []);

  const loadPlates = async () => {
    try {
      const loadedPlates = await getPlates();
      setPlates(loadedPlates.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    } catch (error) {
      console.error('Error loading plates:', error);
    }
  };

  const handleClearPlates = () => {
    Alert.alert(
      'Clear All Plates',
      'Are you sure you want to delete all saved plates?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearPlates();
              setPlates([]);
            } catch (error) {
              console.error('Error clearing plates:', error);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: LicensePlate }) => (
    <View style={styles.plateItem}>
      <Text style={styles.plateNumber}>{item.plateNumber}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
      <Text style={styles.confidence}>
        Confidence: {Math.round(item.confidence)}%
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>License Plates</Text>
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={handleClearPlates}
        >
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>
      
      {plates.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No license plates captured yet</Text>
        </View>
      ) : (
        <FlatList
          data={plates}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: 'red',
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  plateItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  plateNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timestamp: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  confidence: {
    color: '#666',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
