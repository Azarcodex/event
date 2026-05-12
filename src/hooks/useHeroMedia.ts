import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { PaginatedMedia, IMedia } from '@/types/media';

export function useHeroMedia() {
  const { data, isLoading, error } = useQuery<PaginatedMedia>({
    queryKey: ['media', 'hero'],
    queryFn: async () => {
      const { data } = await api.get('/public/media', {
        params: { 
          isHero: true,
          limit: 10 // Max 10 hero banners
        },
      });
      return data;
    },
  });

  return {
    media: data?.media || [],
    loading: isLoading,
    error: error ? (error as any).message : null,
  };
}
