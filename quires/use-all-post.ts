import { getAllNotionPost } from '@/lib/notion';
import { useQuery } from '@tanstack/react-query';

export const useAllPost = () => {
  return useQuery({
    queryKey: ['allPost'],
    queryFn: async () => {
      const posts = await getAllNotionPost();
      return posts;
    }
  });
};
