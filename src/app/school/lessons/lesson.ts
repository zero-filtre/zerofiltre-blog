export interface Lesson {
    id: string;
    title: string;
    content: string;
    summary: string;
    thumbnail: string;
    video: string;
    free: boolean;
    type: any;
    duration: string;
    chapterId: string;
    courseId: string;
    ressources?: Ressource[];
}

export interface Ressource {
    type: string;
    url: string;
    name: string;
}
