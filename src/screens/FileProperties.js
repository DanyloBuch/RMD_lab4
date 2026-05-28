import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

const FileProperties = ({ path, info: meta, onClose }) => {
  const [data, setData] = useState(meta || null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const result = await FileSystem.getInfoAsync(path, { size: true });
        setData(result);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInfo();
  }, [path]);

  const formatSize = (bytes) => {
    if (bytes === undefined || bytes === null) return 'Невідомо';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024;
      i++;
    }
    return `${bytes.toFixed(2)} ${units[i]}`;
  };

  const fileName = path.split('/').pop();
  const isDirectory = !fileName.includes('.');

  return (
    <View style={propsStyles.root}>
      <View style={propsStyles.navbar}>
        <TouchableOpacity onPress={onClose}><Text style={propsStyles.backBtn}>Закрити</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={propsStyles.contentArea}>
        <View style={propsStyles.highlightCard}>
          <Text style={propsStyles.typeIndicator}>{isDirectory ? '📁' : '📄'}</Text>
          <Text style={propsStyles.mainHeader}>{fileName}</Text>
        </View>

        <View style={propsStyles.dataSheet}>
          <Text style={propsStyles.sectionHeader}>Характеристики</Text>
          {[
            { label: 'Найменування:', value: fileName },
            { label: 'Тип:', value: isDirectory ? 'Системна папка' : fileName.split('.').pop() },
            { label: 'Вага:', value: formatSize(data?.size) },
            { label: 'Статус:', value: data?.exists ? 'Активний' : 'Відсутній' },
            { label: 'Змінено:', value: data?.modificationTime ? new Date(data.modificationTime).toLocaleString() : 'N/A' },
          ].map((item, index) => (
            <View key={index} style={propsStyles.rowItem}>
              <Text style={propsStyles.labelKey}>{item.label}</Text>
              <Text style={propsStyles.labelValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const propsStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f0f2f5' },
  navbar: { padding: 15, backgroundColor: '#34495e' },
  backBtn: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  contentArea: { padding: 20 },
  highlightCard: { backgroundColor: '#fff', padding: 25, borderRadius: 15, alignItems: 'center', marginBottom: 20 },
  typeIndicator: { fontSize: 50, marginBottom: 10 },
  mainHeader: { fontSize: 20, fontWeight: '700', color: '#2d3748' },
  dataSheet: { backgroundColor: '#fff', borderRadius: 15, padding: 20 },
  sectionHeader: { fontSize: 17, fontWeight: '700', marginBottom: 15, color: '#4a5568' },
  rowItem: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  labelKey: { flex: 0.4, color: '#718096', fontSize: 14 },
  labelValue: { flex: 0.6, color: '#2d3748', fontSize: 14, fontWeight: '500' },
});

export default FileProperties;