type Fn = () => void;

interface Post {
  id: string;
  title: string;
  date: string | Date;
  published: boolean;
  description?: string;
  readingTime?: string;
}
