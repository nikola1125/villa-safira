export interface Review {
    name: string;
    country: string;
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
    icon: React.ElementType;
    label: string;
    desc: string;
}
