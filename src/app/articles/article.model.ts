export interface Article {
  id?: number;
  title?: string;
  thumbnail?: string;
  content?: string;
  author?: Author;
  createdAt?: string
  publishedAt?: string;
  reactions?: any;
  status?: string;
  tags: Tag[];
  readingTime: number;
}

export interface File {
  data?: any;
  progress?: number;
  inProgress?: boolean;
}

export interface Author {
  id?: string;
  pseudoName?: string;
  firstName?: string;
  lastName?: string;
  registeredOn?: Date;
  profilePicture?: string;
  bio?: string;
  profession?: string;
  socialLinks?: any
}

export interface Tag {
  id?: number;
  name?: string;
  colorCode?: string;
}