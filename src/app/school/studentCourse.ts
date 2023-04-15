import { User } from "../user/user.model";
import { Course } from "./courses/course";
import { Lesson } from "./lessons/lesson";

export interface CourseEnrollment {
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

// ENUMS: A structure that has a set of valid values

// enum UserRoles {
//     User,
//     Admin = 'Admin',
//     Staff = 'Staff'
// }

// if (UserRoles.User) {
//     console.log('This code will never get hit because UserRoles.User = 0 and it is falsy');
// }

// type USER_ROLES = 'User' | 'Admin' | 'Staff';

// export const USER_ROLES = ['User', 'Admin', 'Staff'] as const;
// export type UserRole = typeof USER_ROLES[number]

// type User = {
//     role: UserRole;
// }

// function test(mess: string, role: UserRole) {}

// test('hey', USER_ROLES[1])


export const PRODUCTS = ['COURSE', 'BOOTCAMP'] as const;
export type ProductType = typeof PRODUCTS[number]

export const MODES = ['enrollment', 'payment'] as const;
export type ModeType = typeof MODES[number]

export const INTERVALS = ['month', 'year'] as const;
export type IntervalType = typeof INTERVALS[number]


export interface PaymentConfig {
    productId: number,
    productType: ProductType,
    mode: ModeType,
    proPlan?: boolean,
    recurringInterval?: IntervalType
}
