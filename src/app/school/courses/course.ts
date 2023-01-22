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
    reactions: Reaction[];
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
    id: string;
    position: number;
    title: string;
    content: string;
    image: string;
    courseId: number;
}

export interface Reaction {
    articleId: string;
    courseId: string;
    action: string
}

export enum STATUS {
    'DRAFT',
    'PUBLISHED',
    'IN_REVIEW',
    'COMPLETED',
    'IN_PROGRESS'
}
