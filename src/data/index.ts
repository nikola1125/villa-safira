import {
    Bath, Bed, Car, Clock, Coffee, MapPin, Shield,
    Sun, TreePine, Users, Utensils, Wifi,
} from 'lucide-react';
import type { AmenityItem, Room } from '../types';

export const NAV_LINKS = ['story', 'rooms', 'amenities', 'gallery', 'reviews'] as const;
export type NavLink = typeof NAV_LINKS[number];

export const ROOMS: Room[] = [
    {
        title: 'Deluxe Double Room',
        desc: 'Our signature space — flooded with natural light and featuring curated local art.',
        img: './dhome.jpg',
        images: ['./dhome.jpg', './dhome1.jpg', './dhome2.jpg', './banjo2.jpg'],
        highlights: ['King Size', 'En-suite', 'Garden View'],
    },
    {
        title: 'Double with Balcony',
        desc: 'Start your morning with a sea breeze on your private balcony overlooking the garden.',
        img: './dhome4.jpg',
        images: ['./dhome4.jpg', './dhome5.jpg', './dhome6.jpg', './banjo5.jpg'],
        highlights: ['King Size', 'En-suite', 'Sea Balcony'],
    },
    {
        title: 'Triple Garden View',
        desc: 'Spacious and versatile — perfect for small families or close friends.',
        img: './dhome3.jpg',
        images: ['./dhome3.jpg', './dhome8.jpg', './dhome11.jpg', './banjo6.jpg'],
        highlights: ['Extra Bed', 'En-suite', 'Garden View'],
    },
    {
        title: 'Family Suite',
        desc: 'The ultimate retreat — two connected spaces offering privacy and shared comfort.',
        img: './dhome10.jpg',
        images: ['./dhome10.jpg', './dhome12.jpg', './dhome13.jpg', './banjo7.jpg'],
        highlights: ['King Size', 'En-suite', 'Suite Layout'],
    },
];

export const AMENITIES: AmenityItem[] = [
    { icon: Wifi, label: 'Free Wi-Fi', desc: 'High-speed internet throughout' },
    { icon: Coffee, label: 'Breakfast', desc: 'Freshly served every morning' },
    { icon: Utensils, label: 'Shared Kitchen', desc: 'Fully equipped guest kitchen' },
    { icon: TreePine, label: 'Garden Terrace', desc: 'Lush private garden oasis' },
    { icon: Car, label: 'Free Parking', desc: 'Secure on-site parking' },
    { icon: Bath, label: 'Private Bathrooms', desc: 'En-suite in every room' },
    { icon: Bed, label: 'Premium Bedding', desc: 'Hotel-grade comfort' },
    { icon: Sun, label: 'Balconies', desc: '3 rooms with sea-view balconies' },
    { icon: MapPin, label: 'Near Beach', desc: '100 m from the Adriatic shore' },
    { icon: Users, label: 'Family Friendly', desc: 'Perfect for all ages' },
    { icon: Shield, label: '24/7 Security', desc: 'Secured premises, always safe' },
    { icon: Clock, label: 'Flexible Check-in', desc: 'We work around your schedule' },
];

export const GALLERY_IMAGES: string[] = [
    './jasht3.jpg',
    './dhome3.jpg',
    './dhome1.jpg',
    './dhome2.jpg',
    './dhome.jpg',
    './dhome4.jpg',
    './dhome5.jpg',
    './dhome6.jpg',
    './dhome8.jpg',
    './dhome10.jpg',
    './dhome11.jpg',
    './dhome12.jpg',
    './dhome13.jpg',
    './banjo7.jpg',
    './banjo2.jpg',
    './banjo5.jpg',
    './banjo6.jpg',
    './kuzhin77.jpg',
    './kuzhin.jpg',
    './kuzhin78.jpg',
    './jasht1.jpg',
    './jasht2.jpg',
    './jasht4.jpg',
    './jasht5.jpg',
];

export const STORY_STATS = [
    { value: '4', label: 'Rooms' },
    { value: '100m', label: 'To the Sea' },
    { value: '4★', label: 'Rated' },
];

export const LOCATION_POINTS = [
    '100m from the Adriatic beach',
    'Walking distance to restaurants & cafés',
    '5 min drive to Durrës city center',
    'Easy access to ancient Roman ruins',
];
