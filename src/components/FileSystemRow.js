import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const FileSystemRow = ({ item, onPress, onDelete, onDetails }) => {
  const { isDirectory, name, size } = item;

  // Форматування розміру файлу перенесено в окрему легку функцію
  const renderItemSize = () => {
    if (isDirectory) return 'Тека';
    const bytes = size || 0;
    return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <View style={rowStyles.cardWrapper}>
      <TouchableOpacity style={rowStyles.interactiveArea} onPress={onPress}>
        <Text style={rowStyles.typeIcon}>{isDirectory ? '📁' : '📄'}</Text>
        <View style={rowStyles.metaContainer}>
          <Text style={rowStyles.titleText} numberOfLines={1}>
            {name}
          </Text>
          <Text style={rowStyles.infoSubtitle}>{renderItemSize()}</Text>
        </View>
      </TouchableOpacity>

      <View style={rowStyles.controlButtons}>
        <TouchableOpacity 
          style={[rowStyles.iconBtn, { backgroundColor: '#8e44ad' }]} 
          onPress={onDetails}
        >
          <Text style={rowStyles.iconLabel}>ℹ️</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[rowStyles.iconBtn, { backgroundColor: '#c0392b' }]} 
          onPress={onDelete}
        >
          <Text style={rowStyles.iconLabel}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const rowStyles = StyleSheet.create({
  cardWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  interactiveArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 26,
    marginRight: 10,
  },
  metaContainer: {
    flex: 1,
  },
  titleText: { 
    fontSize: 15,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 1,
  },
  infoSubtitle: { 
    color: '#718096', 
    fontSize: 12,
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLabel: {
    fontSize: 13,
    color: '#ffffff',
  },
});

export default FileSystemRow;