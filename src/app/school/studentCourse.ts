import { User } from "../user/user.model";
import { Course } from "./courses/course";
import { Lesson } from "./lessons/lesson";

export interface CourseSubscription {
    id?: number;
    completedLessons: Lesson[]
    completed: boolean;
    subscriber: User;
    course: Course;
    suspendedAt: string;
    subscribedAt: string;
    lastModifiedAt: string;
    active: boolean;
}