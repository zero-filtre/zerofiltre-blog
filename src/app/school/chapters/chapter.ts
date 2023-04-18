import { Lesson } from "../lessons/lesson";

export interface Chapter {
    id: number;
    title: string;
    courseId: string;
    number: string;
    lessons: Lesson[]
}
