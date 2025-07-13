import { useQuery } from '@tanstack/react-query';

export const usePhotos = () => {
  return useQuery<Map<string, string[]>>({
    queryKey: ['photos'],
    queryFn: () =>
      fetch('/api/photos')
        .then((res) => res.json())
        .then((data) => {
          return new Map(Object.entries(data.data.photos));
        })
  });
};
