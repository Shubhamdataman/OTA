import { useState, useEffect, useCallback } from 'react';
import { getCityList } from '../services/api';

export const useCityAutocomplete = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalItems, setTotalItems] = useState(0);

  const pageSize = 8; // Default page size from API

  const fetchCities = useCallback(async (currentPage, search = '', reset = false) => {
    // Prevent multiple simultaneous requests
    if (loading) return;
    
    setLoading(true);
    
    const payload = {
      filters: search ? [
        {
          field: "cityName",
          operator: "like",
          value: search,
          dataType: "string"
        }
      ] : [],
      sort: [
        {
          field: "cityName",
          order: "asc"
        }
      ],
      page: currentPage,
      size: pageSize
    };

    try {
      const response = await getCityList(payload);
      
      if (response && response.data) {
        // console.log("resss", response?.data)
        const newCities = response.data || [];
        const totalCount = response?.totalCount || 0;
        
        if (reset) {
          setOptions(newCities);
        } else {
          setOptions(prev => [...prev, ...newCities]);
        }
        
        setTotalItems(totalCount);
        
        // Calculate if there are more pages
        const currentItemsCount = reset ? newCities.length : options.length + newCities.length;
        // console.log("currentItemsCount", currentItemsCount);
        // console.log("total", totalCount, " newCitites", newCities.length)
        setHasMore(currentItemsCount < totalCount && newCities.length === pageSize);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, pageSize, options.length]);

  // Initial load
  useEffect(() => {
    fetchCities(0, '', true);
  }, []); // Remove fetchCities from dependencies

  const handleSearch = useCallback((searchValue) => {
    setSearchTerm(searchValue);
    setPage(0);
    setHasMore(true);
    fetchCities(0, searchValue, true);
  }, [fetchCities]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchCities(nextPage, searchTerm, false);
    }
  }, [loading, hasMore, page, searchTerm, fetchCities]);

  const clearOptions = useCallback(() => {
    setOptions([]);
    setPage(0);
    setHasMore(true);
    setSearchTerm('');
  }, []);

  return {
    options,
    loading,
    hasMore,
    searchTerm,
    totalItems,
    handleSearch,
    loadMore,
    clearOptions
  };
};