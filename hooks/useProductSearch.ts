import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Product, ProductCategory } from '@/lib/productTypes';

const fuseOptions = {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'brand', weight: 0.3 },
    { name: 'category', weight: 0.15 },
    { name: 'tags', weight: 0.15 },
  ],
  threshold: 0.4,
  includeScore: true,
  minMatchCharLength: 2,
};

export function useProductSearch(products: Product[]) {
  const [query, setQuery] = useState('');

  const fuse = useMemo(() => new Fuse(products, fuseOptions), [products]);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    return fuse.search(query).map((r) => r.item);
  }, [query, fuse]);

  const grouped = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    for (const p of products) {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    }
    return groups;
  }, [products]);

  const popular = useMemo(
    () =>
      [...products]
        .filter((p) => p.tags.includes('bestseller') || p.rating >= 4.3)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6),
    [products],
  );

  return { query, setQuery, results, grouped, popular };
}
