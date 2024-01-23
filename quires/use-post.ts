import { getNotionPostById } from '@/lib/notion';
import { useQuery } from '@tanstack/react-query';

export const usePost = (id: string) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const post = await getNotionPostById(id);

      return post;
    }
  });
};
