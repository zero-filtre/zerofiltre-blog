import { Tag } from "../articles/article.model";
import { Lesson } from './lesson';
import { Chapter } from './chapter';
import { User } from "../user/user.model";

export interface Course {
    id: string;
    title: string;
    summary: string;
    thumbnail: string;
    firstLessonId: string;
    tags: Tag[];
    chapters: Chapter[];
    lessons: Lesson[];
    enrolledCount: number;
    chapterCount: number;
    lessonCount: number;
    author: User;
    duration: string;
    editorIds: any[];
}
