import type { ElementType } from 'react';

export interface Review {
    name: string;
    country?: string;
    coountry?: string;
    comment: string;
    rating: number;
    date: string;
}


export interface Room {
    title: string;
    desc: string;
    img: string;
    images: string[];
    highlights: string[];
}

export interface AmenityItem {
    icon: ElementType;
    label: string;
    desc: string;
}


