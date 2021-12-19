export interface Article {
  id?: number;
  title?: string;
  thumbnail?: string;
  content?: string;
  author?: Author
  publishedAt?: [];
  reactions: [];
  status: string;
  tags: Tag[];
}

export interface Author {
  id?: number;
  pseudoName?: string;
  firstName?: string;
  lastName?: string;
  registeredOn?: [];
  profilePicture: string;
}

export interface Tag {
  id?: number;
  name?: string;
}