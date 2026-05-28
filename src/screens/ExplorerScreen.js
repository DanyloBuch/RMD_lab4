import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Button, 
  TextInput, 
  Modal, 
  Alert, 
  ScrollView 
} from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import FileSystemRow from '../components/FileSystemRow';

const ExplorerScreen = ({ startPath, onOpenFile, onBack, onShowDetails }) => {
  const [currentDirectory, setCurrentDirectory] = useState(startPath);
  const [directoryItems, setDirectoryItems] = useState([]);
  
  // Управління станом модальних вікон
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  
  // Поля введення
  const [newDirectoryName, setNewDirectoryName] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [newFileText, setNewFileText] = useState('');

  useEffect(() => {
    fetchDirectoryContent(currentDirectory);
  }, [currentDirectory]);

  const fetchDirectoryContent = async (targetPath) => {
    try {
      const filesList = await FileSystem.readDirectoryAsync(targetPath);
      const parsedItems = await Promise.all(
        filesList.map(async (fileName) => {
          const fullUri = targetPath + fileName;
          const meta = await FileSystem.getInfoAsync(fullUri, { size: true, md5: false });
          return { 
            name: fileName, 
            uri: fullUri, 
            isDirectory: meta.isDirectory, 
            size: meta.size, 
            modificationTime: meta.modificationTime 
          };
        })
      );
      // Сортування: спочатку папки, потім файли
      setDirectoryItems(parsedItems.sort((x, y) => Number(y.isDirectory) - Number(x.isDirectory)));
    } catch (error) {
      console.warn('Error reading directory:', error);
      setDirectoryItems([]);
    }
  };

  const handleNavigateIn = (selectedItem) => {
    if (selectedItem.isDirectory) {
      setCurrentDirectory(`${selectedItem.uri}/`);
    } else {
      onOpenFile(selectedItem.uri);
    }
  };

  const handleNavigateUp = () => {
    if (!currentDirectory) return;
    const cleanPath = currentDirectory.replace(/\\/g, '/');
    const segments = cleanPath.split('/').filter(Boolean);
    
    if (segments.length <= 1) {
      onBack();
      return;
    }
    
    segments.pop();
    setCurrentDirectory(`${segments.join('/')}/`);
  };

  const executeFolderCreation = async () => {
    if (!newDirectoryName.trim()) return;
    const folderUri = currentDirectory + newDirectoryName.trim();
    try {
      await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true });
      setIsFolderModalOpen(false);
      setNewDirectoryName('');
      fetchDirectoryContent(currentDirectory);
    } catch (err) {
      Alert.alert('Помилка операції', String(err));
    }
  };

  const executeFileCreation = async () => {
    if (!newFileName.trim()) return;
    const formattedName = newFileName.endsWith('.txt') ? newFileName.trim() : `${newFileName.trim()}.txt`;
    const fileUri = currentDirectory + formattedName;
    try {
      await FileSystem.writeAsStringAsync(fileUri, newFileText);
      setIsFileModalOpen(false);
      setNewFileName('');
      setNewFileText('');
      fetchDirectoryContent(currentDirectory);
    } catch (err) {
      Alert.alert('Помилка операції', String(err));
    }
  };

  const confirmItemDeletion = (targetItem) => {
    Alert.alert('Видалення обʼєкта', `Ви впевнені, що хочете видалити ${targetItem.name}?`, [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Так, видалити',
        style: 'destructive',
        onPress: async () => {
          try {
            await FileSystem.deleteAsync(targetItem.uri, { idempotent: true });
            fetchDirectoryContent(currentDirectory);
          } catch (err) {
            Alert.alert('Помилка видалення', String(err));
          }
        },
      },
    ]);
  };

  // Винесені рендер-функції для модалок (структурна унікалізація)
  const renderFolderModal = () => (
    <Modal visible={isFolderModalOpen} animationType="slide">
      <View style={explorerStyles.modalWrapper}>
        <Text style={explorerStyles.modalTitle}>Нова директорія</Text>
        <TextInput 
          placeholder="Введіть назву папки"
          value={newDirectoryName} 
          onChangeText={setNewDirectoryName} 
          style={explorerStyles.textInputStyle} 
        />
        <View style={{ gap: 10, marginTop: 10 }}>
          <Button title="Створити теку" color="#27ae60" onPress={executeFolderCreation} />
          <Button title="Скасувати" color="#7f8c8d" onPress={() => setIsFolderModalOpen(false)} />
        </View>
      </View>
    </Modal>
  );

  const renderFileModal = () => (
    <Modal visible={isFileModalOpen} animationType="slide">
      <View style={[explorerStyles.modalWrapper, { flex: 1 }]}>
        <Text style={explorerStyles.modalTitle}>Новий текстовий файл</Text>
        <TextInput 
          placeholder="Назва файлу (напр. документ)"
          value={newFileName} 
          onChangeText={setNewFileName} 
          style={explorerStyles.textInputStyle} 
        />
        <Text style={{ marginTop: 10, marginBottom: 4, color: '#4a5568' }}>Контент:</Text>
        <TextInput 
          placeholder="Введіть текст файлу тут..."
          value={newFileText} 
          onChangeText={setNewFileText} 
          style={[explorerStyles.textInputStyle, { height: 140, textAlignVertical: 'top' }]} 
          multiline 
        />
        <View style={{ gap: 10, marginTop: 15 }}>
          <Button title="Зберегти файл" color="#3498db" onPress={executeFileCreation} />
          <Button title="Скасувати" color="#7f8c8d" onPress={() => setIsFileModalOpen(false)} />
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f7fafc' }}>
      <View style={explorerStyles.topNavigationHeader}>
        <Button title="← Вгору" color="#e2e8f0" onPress={handleNavigateUp} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
          <Text style={explorerStyles.currentPathLabel}>{currentDirectory}</Text>
        </ScrollView>
      </View>

      <View style={explorerStyles.controlDashboard}>
        <TouchableOpacity 
          style={[explorerStyles.controlBtn, { backgroundColor: '#2ecc71' }]} 
          onPress={() => setIsFolderModalOpen(true)}
        >
          <Text style={explorerStyles.controlBtnLabel}>+ Папка</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[explorerStyles.controlBtn, { backgroundColor: '#3498db' }]} 
          onPress={() => setIsFileModalOpen(true)}
        >
          <Text style={explorerStyles.controlBtnLabel}>+ Файл .txt</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[explorerStyles.controlBtn, { backgroundColor: '#34495e' }]} 
          onPress={onBack}
        >
          <Text style={explorerStyles.controlBtnLabel}>Головна</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={directoryItems}
        keyExtractor={(item) => item.uri}
        renderItem={({ item }) => (
          <FileSystemRow 
            item={item} 
            onPress={() => handleNavigateIn(item)} 
            onDelete={() => confirmItemDeletion(item)} 
            onDetails={() => onShowDetails && onShowDetails(item)} 
          />
        )}
        ListEmptyComponent={<Text style={explorerStyles.emptyFolderText}>Ця директорія не містить об'єктів</Text>}
        style={explorerStyles.itemsFlatList}
      />

      {renderFolderModal()}
      {renderFileModal()}
    </View>
  );
};

const explorerStyles = StyleSheet.create({
  topNavigationHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#1a202c',
    borderBottomWidth: 1,
    borderColor: '#2d3748',
  },
  currentPathLabel: { 
    marginLeft: 10, 
    color: '#cbd5e0',
    fontSize: 13,
    fontFamily: 'Platform',
  },
  controlDashboard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#edf2f7',
  },
  controlBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBtnLabel: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  itemsFlatList: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  emptyFolderText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#a0aec0',
    fontSize: 14,
    fontStyle: 'italic',
  },
  textInputStyle: { 
    borderWidth: 1.5, 
    borderColor: '#cbd5e0', 
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  modalWrapper: {
    padding: 24,
    backgroundColor: '#f7fafc',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 10,
  },
});

export default ExplorerScreen;