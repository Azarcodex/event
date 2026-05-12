import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

interface Settings {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  socials: {
    instagram: string;
    youtube: string;
  };
}

export function useSettings() {
  return useQuery<Settings>({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await api.get('/public/settings');
      return data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}
