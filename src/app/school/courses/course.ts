import { Tag } from "../../articles/article.model";
import { User } from "../../user/user.model";

export interface Course {
    id: string;
    title: string;
    subTitle: string;
    summary: string;
    thumbnail: string;
    firstLessonId: string;
    tags: Tag[];
    enrolledCount: number;
    chapterCount: number;
    lessonCount: number;
    author: User;
    duration: string;
    editorIds: any[];
    price: string;
    status: string;
    video: string;
    sections: Section[];
    publishedAt: string;
}

export interface Section {
    position: string;
    title: string;
    content: string;
    image: string;
}

export enum STATUS {
    'DRAFT',
    'PUBLISHED',
    'IN_REVIEW',
    'COMPLETED',
    'IN_PROGRESS'
}
