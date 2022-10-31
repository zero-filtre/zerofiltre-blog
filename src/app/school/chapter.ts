import { Lesson } from "./lesson";

export interface Chapter {
    id: string;
    title: string;
    lessons: Lesson[];
    courseId: string;
}
