type Fn = () => void;

interface Post {
  id: string;
  title: string;
  createdTime: string | Date;
  published: boolean;
  cover?: string;
  description?: string;
  readingTime?: string;
  categories?: string[];
}
