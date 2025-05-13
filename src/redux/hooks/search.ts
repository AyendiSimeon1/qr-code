// src/redux/hooks/search.ts
import { useAppDispatch, useAppSelector } from './auth';
import { searchCompanies, setSearchTerm, clearSearchResults } from '../slices/search';

export const useSearch = () => {
  const dispatch = useAppDispatch();
  const { results, isLoading, error, searchTerm } = useAppSelector((state) => state.search);

  const handleSearch = (term: string) => {
    dispatch(setSearchTerm(term));
    dispatch(searchCompanies(term));
  };

  const clearSearch = () => {
    dispatch(clearSearchResults());
    dispatch(setSearchTerm(''));
  };

  return {
    results,
    isLoading,
    error,
    searchTerm,
    handleSearch,
    clearSearch,
  };
};