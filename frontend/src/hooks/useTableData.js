import { useState, useMemo } from 'react';

export const useTableData = (data, initialSortKey = 'id') => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: initialSortKey, direction: 'asc' });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedData = useMemo(() => {
    if (!data) return [];

    let processed = data;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      processed = processed.filter((item) => {
        return Object.values(item).some((val) => 
          String(val).toLowerCase().includes(lowerQuery)
        );
      });
    }

    if (sortConfig.key) {
      processed = [...processed].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return processed;
  }, [data, searchQuery, sortConfig]);

  return {
    processedData,
    searchQuery,
    setSearchQuery,
    sortConfig,
    requestSort,
  };
};