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

const ProductTypes = ['COURSE', 'BOOTCAMP'] as const;
export type ProductType = typeof ProductTypes[number];

const ModeTypes = ['subscription', 'payment'] as const;
export type ModeType = typeof ModeTypes[number];