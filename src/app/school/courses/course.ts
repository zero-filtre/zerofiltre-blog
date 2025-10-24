import { Tag } from "../../articles/article.model";
import { User } from "../../user/user.model";
import { StatusType } from "../studentCourse";

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
    mentored: boolean;
    duration: string;
    editorIds: any[];
    price: number;
    status: StatusType;
    video: string;
    sections: Section[];
    publishedAt: string;
    exclusive?: boolean;
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
    action: 'CLAP' | 'FIRE' | 'LOVE' | 'LIKE';
}

const CourseStatuses = ['PUBLISHED','DRAFT','IN_REVIEW','COMPLETED','IN_PROGRESS'] as const;
export type CourseStatus = typeof CourseStatuses[number];

export type SearchResultCourse = {
    id: number,
    title: string,
    subTitle: string,
    summary: string,
    type: string
}
export type SearchResultArticle = {
    id: number,
    title: string,
    summary: string,
    type: string
}
export type SearchResultLesson = {
    id: number,
    title: string,
    content: string,
    courseId: number,
    type: string
}

export type SearchResultsData = {
    courses: SearchResultCourse[],
    articles: SearchResultArticle[],
    lessons: SearchResultLesson[]
}

export type Review =  {
    id?: number,
    courseId?: number,
    courseTitle?: string,
    
    chapterExplanations?: string,
    chapterSatisfactionScore?: number,
    chapterUnderstandingScore?: number,
    recommendCourse?: true,
    overallChapterSatisfaction?: number,
    chapterImpressions?: string,
    whyRecommendingThisCourse?: string,
    favoriteLearningToolOfTheChapter?: string[],
    reasonFavoriteLearningToolOfTheChapter?: string,
    improvementSuggestion?: string,
    authorId?: number,
    
    comment: string,
    avatar: string,
    name: string,
    role: string,
    stars: number
}

export interface CertificateResponse {
  response: string,
  description: string,
  courseTitle: string,
  ownerFullName: string
}
