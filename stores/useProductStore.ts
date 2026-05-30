import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Product } from '@/lib/productTypes';
import BUNDLED_PRODUCTS from '@/data/products-seed.json';

const CACHE_KEY = 'products_cache';

interface ProductStore {
  products: Product[];
  lastSynced: number | null;
  hydrate: () => void;
  syncFromStorage: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: BUNDLED_PRODUCTS as Product[],
  lastSynced: null,

  hydrate: () => {
    AsyncStorage.getItem(CACHE_KEY).then((cached) => {
      if (cached) {
        try {
          set({ products: JSON.parse(cached) });
        } catch {
          // corrupted cache — keep bundled data
        }
      }
    });
  },

  syncFromStorage: async () => {
    try {
      const url = await getDownloadURL(ref(storage, 'data/products.json'));
      const response = await fetch(url);
      if (!response.ok) return;
      const fresh: Product[] = await response.json();
      if (fresh.length > 0) {
        set({ products: fresh, lastSynced: Date.now() });
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(fresh));
      }
    } catch {
      // silent failure — cached/bundled data stays
    }
  },
}));
