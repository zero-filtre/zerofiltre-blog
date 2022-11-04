import { Tag } from "../articles/article.model";
import { User } from "../user/user.model";

export interface Course {
    id: string;
    title: string;
    summary: string;
    content: string;
    thumbnail: string;
    firstLessonId: string;
    tags: Tag[];
    enrolledCount: number;
    chapterCount: number;
    lessonCount: number;
    author: User;
    duration: string;
    editorIds: any[];
}
