import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface OfflineDataOptions<T> {
  fetchFn: () => Promise<T>;
  storageKey: string;
  dependencies?: any[];
}

export function useOfflineData<T>({ fetchFn, storageKey, dependencies = [] }: OfflineDataOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [lastUpdate, setLastUpdate] = useState('');
  const [source, setSource] = useState<'online' | 'offline'>('offline');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // Load cached data first
      const cached = await AsyncStorage.getItem(storageKey);
      const cachedUpdate = await AsyncStorage.getItem(`${storageKey}_lastUpdate`);
      if (cached) {
        setData(JSON.parse(cached));
        setLastUpdate(cachedUpdate || '');
        setSource('offline');
      }

      // Fetch fresh data
      const network = await NetInfo.fetch();
      if (network.isConnected) {
        try {
          const freshData = await fetchFn();
          setData(freshData);
          setSource('online');
          const now = new Date().toISOString();
          setLastUpdate(now);
          await AsyncStorage.setItem(storageKey, JSON.stringify(freshData));
          await AsyncStorage.setItem(`${storageKey}_lastUpdate`, now);
        } catch (err) {
          console.warn(`Failed to fetch online for ${storageKey}, using cache`);
        }
      }

      setLoading(false);
    };

    loadData();
  }, [fetchFn, storageKey, ...dependencies]);

  return { data, lastUpdate, source, loading };
}
