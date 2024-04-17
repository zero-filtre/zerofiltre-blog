export interface Article {
  id?: number;
  title?: string;
  summary?: string;
  thumbnail?: string;
  content?: string;
  author?: Author;
  createdAt?: string
  publishedAt?: string;
  lastPublishedAt?: string;
  lastSavedAt?: string;
  reactions?: any;
  status?: string;
  tags: Tag[];
  readingTime: number;
  viewsCount: number;
  premium:boolean;
}

export interface File {
  data?: any;
  progress?: number;
  inProgress?: boolean;
}

export interface Author {
  id?: string;
  pseudoName?: string;
  fullName?: string;
  email?: string;
  registeredOn?: Date;
  profilePicture?: string;
  bio?: string;
  profession?: string;
  socialLinks?: any;
  website?: string;
}

export interface Tag {
  id?: number;
  name?: string;
  colorCode?: string;
}