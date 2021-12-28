export interface Article {
  id?: number;
  title?: string;
  thumbnail?: string;
  content?: string;
  author?: Author
  publishedAt?: [];
  reactions?: [];
  status?: string;
  tags: Tag[];
  readingTime: number;
}

export interface Author {
  id?: string;
  pseudoName?: string;
  firstName?: string;
  lastName?: string;
  registeredOn?: [];
  profilePicture?: string;
  bio?: string;
  socials?: []
}

export interface Tag {
  id?: string;
  name?: string;
}