import { useInfiniteQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { PaginatedMedia, MediaType, IMedia } from '@/types/media';
import { useState, useCallback, useMemo } from 'react';

export function useMedia(eventId: string = '', initialType: MediaType | 'ALL' = 'ALL') {
  const [typeFilter, setTypeFilter] = useState<MediaType | 'ALL'>(initialType);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    error,
  } = useInfiniteQuery<PaginatedMedia>({
    queryKey: ['media', eventId, typeFilter],
    queryFn: async ({ pageParam = 1 }) => {
      const url = eventId ? `/admin/events/${eventId}/media` : '/public/media';
      const { data } = await api.get(url, {
        params: { 
          type: typeFilter, 
          page: pageParam, 
          limit: 12 
        },
      });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
  });

  const media = useMemo(() => {
    return data?.pages.flatMap((page) => page.media) || [];
  }, [data]);

  const total = data?.pages[0]?.total || 0;

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const deleteMedia = useCallback(async (id: string) => {
    await api.delete(`/admin/media/${id}`);
    refresh();
  }, [refresh]);

  return {
    media,
    total,
    loading: isLoading,
    loadingMore: isFetchingNextPage,
    error: error ? (error as any).message : null,
    hasMore: hasNextPage,
    typeFilter,
    setTypeFilter,
    loadMore,
    refresh,
    deleteMedia,
  };
}
