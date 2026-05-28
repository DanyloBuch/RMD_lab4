import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

// Імпорти екранів залишаємо такими ж, щоб вони працювали з твоїми файлами
import MainScreen from './src/screens/FileManagerDashboard';
import ExplorerScreen from './src/screens/ExplorerScreen';
import FileEditorScreen from './src/screens/TextContentEditor';
import FileDetailScreen from './src/screens/FileProperties';

const AppNavigator = () => {
  // Змінена структура стану для навігації
  const [currentView, setCurrentView] = useState({
    id: 'dashboard',
    targetPath: null,
    fileData: null,
  });

  // Перейменовані функції-обробники
  const handleLaunchExplorer = () => {
    setCurrentView({ id: 'browser', targetPath: FileSystem.documentDirectory });
  };

  const handleOpenFile = (filePath) => {
    setCurrentView({ id: 'editor', targetPath: filePath });
  };

  const handleShowProperties = (filePath, metaInfo) => {
    setCurrentView({ id: 'properties', targetPath: filePath, fileData: metaInfo });
  };

  const returnToDashboard = () => {
    setCurrentView({ id: 'dashboard', targetPath: null, fileData: null });
  };

  const returnToBrowser = () => {
    setCurrentView({ id: 'browser', targetPath: FileSystem.documentDirectory });
  };

  // Використовуємо switch-case замість && для кращої читабельності та унікальності коду
  const renderCurrentScreen = () => {
    switch (currentView.id) {
      case 'dashboard':
        return <MainScreen onOpenExplorer={handleLaunchExplorer} />;
      
      case 'browser':
        return (
          <ExplorerScreen
            startPath={currentView.targetPath}
            onOpenFile={handleOpenFile}
            onShowDetails={(fileObj) => handleShowProperties(fileObj.uri, fileObj)}
            onBack={returnToDashboard}
          />
        );
      
      case 'editor':
        return (
          <FileEditorScreen 
            path={currentView.targetPath} 
            onClose={returnToBrowser} 
          />
        );
      
      case 'properties':
        return (
          <FileDetailScreen 
            path={currentView.targetPath} 
            info={currentView.fileData} 
            onClose={returnToBrowser} 
          />
        );
        
      default:
        return <View />;
    }
  };

  return (
    <SafeAreaView style={uiStyles.mainBackground}>
      {renderCurrentScreen()}
    </SafeAreaView>
  );
};

const uiStyles = StyleSheet.create({
  mainBackground: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Додано легкий фон замість стандартного білого
    paddingTop: 35,
  },
});

export default AppNavigator;

