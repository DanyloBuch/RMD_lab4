import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

const TextContentEditor = ({ path, onClose }) => {
  const [editorText, setEditorText] = useState('');
  const [fileSize, setFileSize] = useState(0);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await FileSystem.readAsStringAsync(path);
        const stats = await FileSystem.getInfoAsync(path, { size: true });
        setEditorText(data);
        setFileSize(stats.size);
      } catch (err) {
        Alert.alert('Помилка', 'Не вдалося прочитати файл');
      }
    };
    loadContent();
  }, [path]);

  const commitChanges = async () => {
    try {
      await FileSystem.writeAsStringAsync(path, editorText);
      Alert.alert('Готово', 'Вміст успішно оновлено');
    } catch (err) {
      Alert.alert('Помилка', 'Збереження не вдалося');
    }
  };

  return (
    <View style={editorStyles.screen}>
      <View style={editorStyles.headerBar}>
        <TouchableOpacity onPress={onClose}><Text style={editorStyles.btnText}>Назад</Text></TouchableOpacity>
        <Text style={editorStyles.fileName}>{path.split('/').pop()}</Text>
      </View>

      <TextInput 
        style={editorStyles.textInput}
        value={editorText}
        onChangeText={setEditorText}
        multiline
        textAlignVertical="top"
      />

      <TouchableOpacity style={editorStyles.saveBtn} onPress={commitChanges}>
        <Text style={editorStyles.saveBtnLabel}>Зберегти зміни</Text>
      </TouchableOpacity>
    </View>
  );
};

const editorStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff' },
  headerBar: { flexDirection: 'row', padding: 15, backgroundColor: '#34495e', alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold' },
  fileName: { color: 'white', marginLeft: 15, fontSize: 16 },
  textInput: { flex: 1, padding: 20, fontSize: 16, color: '#333' },
  saveBtn: { backgroundColor: '#27ae60', padding: 20, alignItems: 'center' },
  saveBtnLabel: { color: 'white', fontWeight: '700', fontSize: 16 },
});

export default TextContentEditor;