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
    ressources: Ressource[];
    number: number;
}

export interface Ressource {
    id: number;
    type: string;
    url: string;
    name: string;
}
