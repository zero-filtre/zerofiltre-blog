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

// const ProductTypes = ['COURSE', 'BOOTCAMP'] as const;
// export type ProductType = typeof ProductTypes[number];

// const ModeTypes = ['subscription', 'payment'] as const;
// export type ModeType = typeof ModeTypes[number];

// const IntervalTypes = ['month', 'year'] as const;
// export type IntervalType = typeof IntervalTypes[number];

export const ProductTypes = ['COURSE', 'BOOTCAMP'];

export const ModeTypes = ['subscription', 'payment'];

export const IntervalTypes = ['month', 'year'];

export interface PaymentProMonth {
    productId: number,
    productType: string,
    mode: string,
    proPlan: boolean,
    recurringInterval: string
}

export interface PaymentProYear {
    productId: number,
    productType: string,
    mode: string,
    proPlan: boolean,
    recurringInterval: string
}

export interface PaymentBasicOne {
    productId: number,
    productType: string,
    mode: string
}

export interface PaymentBasicThree {
    productId: number,
    productType: string,
    mode: string,
    proPlan?: boolean
}