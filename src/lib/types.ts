import type { BOOK_STATUS } from './constants/bookStatus';

export interface Book {
    id: string;
    name: string;
    author: string;
    imgsrc: string;
    status: typeof BOOK_STATUS[keyof typeof BOOK_STATUS];
    rating?: number;
} 