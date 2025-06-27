import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const Tabs = ({ activeTab, handleTabChange }) => (
  <View style={styles.tabsContainer}>
    <TouchableOpacity
      style={[styles.tabText, activeTab === 'library' && styles.tabTextActive]}
      onPress={() => handleTabChange('library')}
    >
      <Ionicons name="library" size={24} color="black" />
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tabText, activeTab === 'collection' && styles.tabTextActive]}
      onPress={() => handleTabChange('collection')}
    >
      <MaterialIcons name="collections-bookmark" size={24} color="black" />
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tabText, activeTab === 'shared' && styles.tabTextActive]}
      onPress={() => handleTabChange('shared')}
    >
      <Ionicons name="share-social" size={24} color="black" />
    </TouchableOpacity>
    {/* Thêm các tab khác ở đây nếu cần */}
  </View>
);

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'nowrap',
    padding: 1,
    backgroundColor: '#F2F4F7',
    borderRadius: 10,
    height: 60,
    minWidth: '100%',
    paddingHorizontal: 10,
  },
  tabText: {
    width: 80,
    fontWeight: '400',
    fontSize: 18,
    color: '#6b7280',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    flexDirection: 'row',
    display: 'flex',
  },
  tabTextActive: {
    color: '#000',
    fontWeight: 'bold',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Tabs;
