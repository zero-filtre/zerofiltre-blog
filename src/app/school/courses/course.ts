import { Tag } from "../../articles/article.model";
import { User } from "../../user/user.model";

export interface Course {
    id: number;
    title: string;
    subTitle: string;
    summary: string;
    thumbnail: string;
    firstLessonId: string;
    tags: Tag[];
    reactions: Reaction[];
    enrolledCount: number;
    chapterCount: number;
    lessonsCount: number;
    author: User;
    duration: string;
    editorIds: any[];
    price: number;
    status: string;
    video: string;
    sections: Section[];
    publishedAt: string;
}

export interface Section {
    id: number;
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

const CourseStatuses = ['PUBLISHED','DRAFT','IN_REVIEW','COMPLETED','IN_PROGRESS'] as const;
export type CourseStatus = typeof CourseStatuses[number];
