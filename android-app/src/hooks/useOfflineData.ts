import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface OfflineDataOptions<T> {
  fetchFn: () => Promise<T>;
  storageKey: string;
}

export function useOfflineData<T>({ fetchFn, storageKey }: OfflineDataOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [lastUpdate, setLastUpdate] = useState('');
  const [source, setSource] = useState<'online' | 'offline'>('offline');
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  // Load data function
  const loadData = useCallback(async () => {
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
        return;
      } catch (err) {
        console.warn(`Failed to fetch online for ${storageKey}, using cache`);
      }
    }

    // Offline or fetch failed
    const cached = await AsyncStorage.getItem(storageKey);
    const cachedUpdate = await AsyncStorage.getItem(`${storageKey}_lastUpdate`);
    if (cached) {
      setData(JSON.parse(cached));
      setLastUpdate(cachedUpdate || '');
      setSource('offline');
    }
  }, [fetchFn, storageKey]);

  // Initial load + refresh on reconnect
  useEffect(() => {
    loadData();

    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && !isConnected) {
        console.log(`Network reconnected — refreshing ${storageKey}`);
        loadData();
      }
      setIsConnected(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, [isConnected, loadData, storageKey]);

  useEffect(() => {
    setLoading(false);
  }, [data]);

  return { data, lastUpdate, source, loading, reload: loadData };
}
