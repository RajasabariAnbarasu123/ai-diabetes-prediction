import { useState, useCallback } from 'react';

const usePagination = (initialPage = 0, initialSize = 10) => {
  const [page, setPage] = useState(initialPage);
  const [size] = useState(initialSize);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const goToPage = useCallback((newPage) => {
    if (newPage >= 0 && (totalPages === 0 || newPage < totalPages)) {
      setPage(newPage);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (totalPages === 0 || page < totalPages - 1) setPage(prev => prev + 1);
  }, [page, totalPages]);

  const prevPage = useCallback(() => {
    if (page > 0) setPage(prev => prev - 1);
  }, [page]);

  const setPaginationInfo = useCallback(({ page: p, totalPages: tp, totalElements: te }) => {
    if (p !== undefined) setPage(p);
    if (tp !== undefined) setTotalPages(tp);
    if (te !== undefined) setTotalElements(te);
  }, []);

  return {
    page,
    size,
    totalPages,
    totalElements,
    setPage,
    goToPage,
    nextPage,
    prevPage,
    setPaginationInfo,
  };
};

export default usePagination;