import { Lesson } from "../lessons/lesson";

export interface Chapter {
    id: string;
    title: string;
    courseId: string;
    number: string;
    lessons: Lesson[]
}
