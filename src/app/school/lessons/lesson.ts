export interface Lesson {
    id: number;
    title: string;
    content: string;
    summary: string;
    thumbnail: string;
    video: string;
    free: boolean;
    type: any;
    duration: string;
    chapterId: number;
    resources: Resource[];
    number: number;
}

export interface Resource {
    id?: number,
    lessonId: string;
    type: string;
    url: string;
    name: string;
}
