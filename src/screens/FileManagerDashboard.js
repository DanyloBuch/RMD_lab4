import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

export default function MainScreen({ onOpenExplorer }) {
  const [stats, setStats] = useState({ total: null, free: null });

  useEffect(() => {
    (async () => {
      try {
        const free = await FileSystem.getFreeDiskStorageAsync();
        const total = await FileSystem.getTotalDiskCapacityAsync();
        setStats({ free, total });
      } catch (e) {
        console.warn('Stats not available', e);
      }
    })();
  }, []);

  function human(n) {
    if (n == null) return 'N/A';
    const gb = n / (1024 * 1024 * 1024);
    return gb.toFixed(2) + ' GB';
  }

  const used = stats.total != null && stats.free != null ? stats.total - stats.free : null;
  const usedPercent = used != null && stats.total != null ? ((used / stats.total) * 100).toFixed(1) : 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}> Файловий менеджер</Text>
        <Text style={styles.subtitle}>Лаб. робота №4</Text>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Статистика пам'яті пристрою</Text>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Загальний обсяг:</Text>
          <Text style={styles.statValue}>{human(stats.total)}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Вільно:</Text>
          <Text style={[styles.statValue, { color: '#27ae60' }]}>{human(stats.free)}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Зайнято:</Text>
          <Text style={[styles.statValue, { color: '#e74c3c' }]}>{human(used)}</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: usedPercent + '%' }]} />
        </View>
        <Text style={styles.progressText}>{usedPercent}% використано</Text>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button 
            title="  Відкрити оглядач" 
            onPress={onOpenExplorer}
            color="#3498db"
          />
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Можливості:</Text>
        <Text style={styles.infoBullet}>✓ Навігація по папках</Text>
        <Text style={styles.infoBullet}>✓ Створення файлів та папок</Text>
        <Text style={styles.infoBullet}>✓ Редагування .txt файлів</Text>
        <Text style={styles.infoBullet}>✓ Перегляд деталей файлу</Text>
        <Text style={styles.infoBullet}>✓ Видалення файлів та папок</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: '#2c3e50',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d'
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2c3e50'
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#555'
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50'
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    marginVertical: 12,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e74c3c',
    borderRadius: 4
  },
  progressText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'right'
  },
  buttonContainer: {
    marginBottom: 20
  },
  buttonWrapper: {
    borderRadius: 8,
    overflow: 'hidden'
  },
  infoBox: {
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20
  },
  infoTitle: {
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50'
  },
  infoBullet: {
    fontSize: 13,
    marginVertical: 4,
    color: '#34495e'
  }
});
