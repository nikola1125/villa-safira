import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
// @ts-ignore
import countryList from "react-select-country-list";
import {
    Bath,
    Bed,
    Calendar,
    Car,
    ChevronLeft,
    ChevronRight,
    Clock,
    Coffee,
    MapPin,
    Shield,
    Star,
    StarOff,
    Sun,
    TreePine,
    Users,
    Utensils,
    Wifi,
    X,
    ChevronDown,
    Mail,
    Phone
} from "lucide-react";
import BounceCards from './BounceCards';
import Stack from './Stack';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useInView } from 'motion/react';
import { apiClient } from './api';

/* ─── DATA ────────────────────────────────────────────────────────── */
interface GalleryItem { id: string; title: string; coverImage: string; images: string[]; }
interface Review { name: string; country: string; comment: string; rating: number; date: string; }

const GALLERY_DATA: GalleryItem[] = [
    { id: "deluxe-double", title: "Deluxe Double Room", coverImage: "./dhome1.jpg", images: ["./dhome1.jpg", "./dhome2.jpg", "./dhome3.jpg", "./dhome4.jpg"] },
    { id: "deluxe-double-balcony", title: "Deluxe Double with Balcony", coverImage: "./dhome5.jpg", images: ["./dhome5.jpg", "./dhome6.jpg", "./dhome7.jpg"] },
    { id: "triple-garden", title: "Triple Room – Garden View", coverImage: "./dhome8.jpg", images: ["./dhome8.jpg", "./dhome9.jpg", "./dhome10.jpg"] },
    { id: "family-suite", title: "Deluxe Family Suite", coverImage: "./dhome11.jpg", images: ["./dhome11.jpg", "./dhome12.jpg"] },
    { id: "outdoor", title: "Outdoor Spaces", coverImage: "./jasht1.jpg", images: ["./jasht1.jpg", "./jasht2.jpg", "./jasht3.jpg"] },
];
const GALLERY_IMAGES = GALLERY_DATA.map(g => g.coverImage);
const GALLERY_TITLES = GALLERY_DATA.map(g => g.title);
const COUNTRY_OPTIONS = countryList().getData();

const AMENITIES = [
    { icon: Wifi, label: "Free Wi-Fi", desc: "High-speed internet throughout" },
    { icon: Coffee, label: "Breakfast", desc: "Freshly served every morning" },
    { icon: Utensils, label: "Shared Kitchen", desc: "Fully equipped guest kitchen" },
    { icon: TreePine, label: "Garden Terrace", desc: "Lush private garden oasis" },
    { icon: Car, label: "Free Parking", desc: "Secure on-site parking" },
    { icon: Bath, label: "Private Bathrooms", desc: "En-suite in every room" },
    { icon: Bed, label: "Premium Bedding", desc: "Hotel-grade comfort" },
    { icon: Sun, label: "Balconies", desc: "3 rooms with sea-view balconies" },
    { icon: MapPin, label: "Near Beach", desc: "100 m from the Adriatic shore" },
    { icon: Users, label: "Family Friendly", desc: "Perfect for all ages" },
    { icon: Shield, label: "24/7 Security", desc: "Secured premises, always safe" },
    { icon: Clock, label: "Flexible Check-in", desc: "We work around your schedule" },
];

/* ─── HELPERS ─────────────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

function MaskReveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    return (
        <div className={`overflow-hidden ${className}`} ref={ref}>
            <motion.div
                initial={{ y: "105%" }}
                animate={inView ? { y: "0%" } : {}}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay }}
            >
                {children}
            </motion.div>
        </div>
    );
}

/* ─── MAIN COMPONENT ──────────────────────────────────────────────── */
const App: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [newReview, setNewReview] = useState({
        name: "",
        country: "",
        comment: "",
        rating: 5
    });
    const [backgroundOffset, setBackgroundOffset] = useState(0);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [lightboxState, setLightboxState] = useState({ open: false, index: 0, images: [] as string[] });

    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 900], [0, 380]);
    const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
    const heroScale = useTransform(scrollY, [0, 800], [1, 1.08]);

    useMotionValueEvent(scrollY, "change", v => setIsScrolled(v > 60));

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await apiClient.get('/api/reviews');
                setReviews(response.data);
                localStorage.setItem("reviews", JSON.stringify(response.data));
            } catch (err) {
                console.error('Error fetching reviews:', err);
                const localReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
                setReviews(localReviews);
            }
        };
        fetchReviews();
    }, []);
    useEffect(() => {
        // Add this effect for mobile zoom prevention
        const preventZoom = (e: TouchEvent) => {
            if (e.touches.length > 1) e.preventDefault();
        };

        document.addEventListener('touchmove', preventZoom, { passive: false });
        return () => document.removeEventListener('touchmove', preventZoom);
    }, []);

    const countryOptions = countryList().getData();

    const handleAddReview = async () => {
        if (newReview.name && newReview.country && newReview.comment && newReview.rating) {
            try {
                await apiClient.post('/api/reviews', {
                    name: newReview.name,
                    country: newReview.country,
                    comment: newReview.comment,
                    rating: newReview.rating
                });
                const freshResponse = await apiClient.get('/api/reviews');
                setReviews(freshResponse.data);
                localStorage.setItem("reviews", JSON.stringify(freshResponse.data));
                setNewReview({ name: "", country: "", comment: "", rating: 5 });
            } catch (err) {
                console.error('Error saving to MongoDB, using localStorage instead:', err);
                const reviewToSave = { ...newReview, date: new Date().toLocaleDateString() };
                const updatedReviews = [reviewToSave, ...reviews];
                setReviews(updatedReviews);
                localStorage.setItem("reviews", JSON.stringify(updatedReviews));
                setNewReview({ name: "", country: "", comment: "", rating: 5 });
            }
        }
    };

    const galleryData: GalleryItem[] = [
        {
            id: "bedrooms",
            title: "Bedrooms",
            coverImage: "./dhome3.jpg",
            images: [
                "./dhome3.jpg", "./dhome1.jpg", "./dhome2.jpg", "./dhome.jpg",
                "./dhome4.jpg", "./dhome5.jpg", "./dhome6.jpg", "./dhome8.jpg",
                "./dhome10.jpg", "./dhome11.jpg", "./dhome12.jpg", "./dhome13.jpg",
                "./dhome14.jpg", "./dhome72.jpg", "./dhome15.jpg", "./dhome70.jpg", "./dhome71.jpg"
            ]
        },
        {
            id: "bathrooms",
            title: "Bathrooms",
            coverImage: "./banjo7.jpg",
            images: ["./banjo7.jpg", "./banjo2.jpg", "./banjo5.jpg", "./banjo6.jpg", "./banjo1.jpg", "./banjo8.jpg"]
        },
        {
            id: "kitchen",
            title: "Kitchen",
            coverImage: "./kuzhin77.jpg",
            images: ["./kuzhin77.jpg", "./kuzhin.jpg", "./kuzhin78.jpg", "./kuzhin79.jpg", "./kuzhin2.jpg"]
        },
        {
            id: "outdoor",
            title: "Outdoor",
            coverImage: "./jasht1.jpg",
            images: ["./jasht1.jpg", "./jasht2.jpg", "./jasht3.jpg", "./jasht4.jpg", "./jasht5.jpg", "./jasht6.jpg", "./jasht7.jpg", "./jasht8.jpg"]
        }
    ];

    const openWhatsApp = () => {
        const phoneNumber = '+355692429567';
        const message = 'Hello, I have a question about Villa Safira.';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleBookNow = () => window.open("https://www.booking.com/hotel/al/villa-sol-durres.html", "_blank");

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setIsMenuOpen(false);
    };

    const renderStars = (rating: number) => (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i =>
                i <= rating
                    ? <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    : <Star key={i} className="w-4 h-4 text-stone-300" />
            )}
        </div>
    );

    const NAV_LINKS = ["story", "rooms", "amenities", "gallery", "reviews"];

    return (
        <div className="font-poppins bg-amber-50 text-amber-900 min-h-screen">
            {/* Add viewport meta tag in React */}
            <meta name="viewport"
                content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, shrink-to-fit=no, viewport-fit=cover" />

            {/* ══════════════════════════════════════════════════════
                NAV — transparent on hero, opaque after scroll
            ══════════════════════════════════════════════════════ */}
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${isScrolled
                    ? "bg-[#F9F6F1]/95 backdrop-blur-xl border-b border-stone-200/80 py-3"
                    : "bg-transparent py-6"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className={`font-serif text-xl sm:text-2xl tracking-widest font-bold uppercase transition-colors duration-700 ${isScrolled ? "text-[#1C1613]" : "text-white"
                            }`}
                    >
                        Villa Safira
                    </button>

                    {/* Desktop links */}
                    <nav className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map(link => (
                            <button
                                key={link}
                                onClick={() => scrollTo(link)}
                                className={`text-sm tracking-widest uppercase font-medium transition-all duration-500 hover:opacity-50 ${isScrolled ? "text-[#1C1613]" : "text-white/90"
                                    }`}
                            >
                                {link}
                            </button>
                        ))}
                        <button
                            onClick={handleBookNow}
                            className={`text-sm tracking-widest uppercase font-semibold px-5 py-2.5 rounded-full border transition-all duration-500 ${isScrolled
                                ? "border-[#1C1613] text-[#1C1613] hover:bg-[#1C1613] hover:text-white"
                                : "border-white text-white hover:bg-white hover:text-[#1C1613]"
                                }`}
                        >
                            Book Now
                        </button>
                    </nav>

                    {/* Hamburger */}
                    <button
                        onClick={() => setIsMenuOpen(p => !p)}
                        className={`md:hidden flex flex-col gap-1.5 p-2 transition-colors duration-500 ${isScrolled ? "text-[#1C1613]" : "text-white"
                            }`}
                        aria-label="Menu"
                    >
                        <motion.span
                            animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                            className="block w-6 h-0.5 bg-current"
                        />
                        <motion.span
                            animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                            className="block w-6 h-0.5 bg-current"
                        />
                        <motion.span
                            animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                            className="block w-6 h-0.5 bg-current"
                        />
                    </button>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="md:hidden overflow-hidden bg-[#F9F6F1] border-t border-stone-200"
                        >
                            <div className="px-6 py-4 flex flex-col gap-4">
                                {[...NAV_LINKS, "contact"].map(link => (
                                    <button
                                        key={link}
                                        onClick={() => link === "contact" ? document.querySelector("footer")?.scrollIntoView({ behavior: "smooth" }) || setIsMenuOpen(false) : scrollTo(link)}
                                        className="text-sm tracking-widest uppercase font-medium text-left text-[#1C1613] py-2 border-b border-stone-200/60 hover:opacity-50 transition-opacity"
                                    >
                                        {link}
                                    </button>
                                ))}
                                <button
                                    onClick={handleBookNow}
                                    className="mt-2 w-full text-sm tracking-widest uppercase font-semibold py-3 rounded-full bg-[#1C1613] text-white"
                                >
                                    Book Now
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* ══════════════════════════════════════════════════════
                § 1 — CINEMATIC HERO
            ══════════════════════════════════════════════════════ */}
            <section className="relative h-screen overflow-hidden bg-black">
                {/* Parallax background */}
                <motion.div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/jasht3.jpg')", y: heroY, scale: heroScale }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

                {/* Hero content */}
                <motion.div
                    style={{ opacity: heroOpacity }}
                    className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
                >
                    <motion.p
                        initial={{ opacity: 0, letterSpacing: "0.5em" }}
                        animate={{ opacity: 1, letterSpacing: "0.3em" }}
                        transition={{ duration: 1.5, delay: 0.3 }}
                        className="text-amber-300 text-xs sm:text-sm uppercase tracking-[0.3em] mb-6 font-medium"
                    >
                        Durrës, Albania · Adriatic Coast
                    </motion.p>

                    <div className="overflow-hidden mb-4">
                        <motion.h1
                            initial={{ y: "110%" }}
                            animate={{ y: "0%" }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                            className="font-serif text-white text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light leading-none"
                        >
                            Villa Safira
                        </motion.h1>
                    </div>

                    <div className="overflow-hidden mb-10">
                        <motion.p
                            initial={{ y: "120%" }}
                            animate={{ y: "0%" }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
                            className="text-white/70 text-lg sm:text-xl md:text-2xl font-light max-w-xl"
                        >
                            Where the Adriatic breeze meets Albanian warmth
                        </motion.p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <button
                            onClick={handleBookNow}
                            className="px-8 py-4 bg-white text-[#1C1613] font-semibold text-sm tracking-widest uppercase rounded-full hover:bg-amber-50 transition-all duration-300"
                        >
                            Reserve Your Stay
                        </button>
                        <button
                            onClick={() => scrollTo("story")}
                            className="px-8 py-4 border border-white/60 text-white font-medium text-sm tracking-widest uppercase rounded-full hover:bg-white/10 transition-all duration-300"
                        >
                            Discover the Story
                        </button>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60"
                >
                    <span className="text-[10px] tracking-[0.25em] uppercase">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    >
                        <ChevronDown className="w-5 h-5" />
                    </motion.div>
                </motion.div>
            </section>

            {/* ══════════════════════════════════════════════════════
                § 2 — THE STORY (dark, full-width narrative)
            ══════════════════════════════════════════════════════ */}
            <section id="story" className="bg-[#130E0A] text-white py-32 sm:py-48">
                <div className="max-w-7xl mx-auto px-6 sm:px-12">

                    {/* Chapter label */}
                    <FadeUp>
                        <p className="text-amber-400/70 text-xs tracking-[0.4em] uppercase mb-16">Chapter I — Arrive</p>
                    </FadeUp>

                    {/* Big editorial statement */}
                    <div className="mb-24 sm:mb-40">
                        <MaskReveal>
                            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-[1.05] max-w-5xl">
                                A place where<br />
                                <em className="text-amber-400 not-italic">time slows down.</em>
                            </h2>
                        </MaskReveal>
                    </div>

                    {/* Two-column story layout */}
                    <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center mb-32 sm:mb-48">
                        {/* Left — image */}
                        <FadeUp delay={0.1}>
                            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden">
                                <motion.img
                                    src="./dhome7.jpg"
                                    alt="Villa exterior"
                                    className="w-full h-full object-cover"
                                    whileHover={{ scale: 1.04 }}
                                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <p className="text-white/70 text-sm tracking-widest uppercase">Est. on the Albanian Riviera</p>
                                </div>
                            </div>
                        </FadeUp>

                        {/* Right — narrative text */}
                        <div className="space-y-8">
                            <FadeUp delay={0.2}>
                                <p className="text-white/50 text-xs tracking-[0.3em] uppercase">The Retreat</p>
                            </FadeUp>
                            <FadeUp delay={0.3}>
                                <p className="text-white/90 text-2xl sm:text-3xl font-light leading-relaxed font-serif">
                                    A charming four-floor retreat, just a breath away from the Adriatic Sea.
                                </p>
                            </FadeUp>
                            <FadeUp delay={0.4}>
                                <p className="text-white/60 text-base sm:text-lg leading-loose">
                                    Villa Safira is not just a place to sleep — it's your personal corner of the Albanian coast.
                                    Four individually designed rooms, each with private bathrooms, enveloped in warmth
                                    and natural light. Breakfast is served fresh every morning, and the sea is yours to discover.
                                </p>
                            </FadeUp>
                            <FadeUp delay={0.5}>
                                <div className="grid grid-cols-3 gap-6 pt-4">
                                    {[["4", "Rooms"], ["100m", "To the Sea"], ["4★", "Rated"]].map(([n, l]) => (
                                        <div key={l} className="border-l border-amber-400/30 pl-4">
                                            <div className="font-serif text-3xl text-amber-400 font-bold">{n}</div>
                                            <div className="text-white/40 text-xs tracking-widest uppercase mt-1">{l}</div>
                                        </div>
                                    ))}
                                </div>
                            </FadeUp>
                        </div>
                    </div>

                    {/* Chapter II — The Location */}
                    <FadeUp>
                        <p className="text-amber-400/70 text-xs tracking-[0.4em] uppercase mb-12">Chapter II — The Setting</p>
                    </FadeUp>

                    <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
                        {/* Left — text */}
                        <div className="order-2 md:order-1 space-y-8">
                            <MaskReveal>
                                <h3 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light leading-tight text-white">
                                    The sea is your<br />
                                    <em className="text-amber-400 not-italic">backyard.</em>
                                </h3>
                            </MaskReveal>
                            <FadeUp delay={0.3}>
                                <p className="text-white/60 text-base sm:text-lg leading-loose">
                                    Situated in the heart of Durrës — Albania's most beloved coastal city — Villa Safira
                                    places you 100 meters from the Adriatic shore. Wake up to salty air, spend your days
                                    on golden sands, and return each evening to the comfort of your private sanctuary.
                                </p>
                            </FadeUp>
                            <FadeUp delay={0.4}>
                                <div className="flex flex-col gap-3">
                                    {["100m from the Adriatic beach", "Walking distance to restaurants & cafés", "5 min drive to Durrës city center", "Easy access to ancient Roman ruins"].map(item => (
                                        <div key={item} className="flex items-center gap-3 text-white/70 text-sm">
                                            <div className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </FadeUp>
                        </div>

                        {/* Right — image stack */}
                        <FadeUp delay={0.1} className="order-1 md:order-2">
                            <div className="relative">
                                <div className="aspect-[4/5] rounded-3xl overflow-hidden">
                                    <motion.img
                                        src="./jasht1.jpg"
                                        alt="Outdoor area"
                                        className="w-full h-full object-cover"
                                        whileHover={{ scale: 1.04 }}
                                        transition={{ duration: 1.2 }}
                                    />
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, x: 40, y: 40 }}
                                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.9, delay: 0.5 }}
                                    className="absolute -bottom-8 -right-4 sm:-right-8 w-2/3 aspect-video rounded-2xl overflow-hidden border-4 border-[#130E0A] shadow-2xl"
                                >
                                    <img src="./jasht2.jpg" alt="Garden" className="w-full h-full object-cover" />
                                </motion.div>
                            </div>
                        </FadeUp>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                § 3 — THE SANCTUARY (Rooms)
            ══════════════════════════════════════════════════════ */}
            <section id="rooms" className="py-32 sm:py-48 bg-[#F9F6F1]">
                <div className="max-w-7xl mx-auto px-6 sm:px-12">
                    <FadeUp>
                        <p className="text-[#1C1613]/40 text-xs tracking-[0.4em] uppercase mb-12">Chapter III — The Sanctuary</p>
                    </FadeUp>

                    <div className="mb-24">
                        <MaskReveal>
                            <h2 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-light text-[#1C1613] leading-none mb-8">
                                Private<br />
                                <em className="text-amber-600 not-italic">Sanctuaries.</em>
                            </h2>
                        </MaskReveal>
                        <FadeUp delay={0.2}>
                            <p className="text-stone-500 text-lg sm:text-xl max-w-2xl font-light leading-relaxed">
                                Four boutique rooms designed for deep rest. Each space is a blend of minimal coastal
                                aesthetics and premium Albanian hospitality.
                            </p>
                        </FadeUp>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
                        {[
                            { title: "Deluxe Double Room", desc: "Our signature space. Flooded with natural light and featuring curated local art.", img: "./dhome.jpg" },
                            { title: "Double with Balcony", desc: "Start your morning with a sea breeze on your private balcony overlooking the garden.", img: "./dhome4.jpg" },
                            { title: "Triple Garden View", desc: "Spacious and versatile. Perfect for small families or close friends.", img: "./dhome3.jpg" },
                            { title: "Family Suite", desc: "The ultimate retreat. Two connected spaces offering privacy and shared comfort.", img: "./dhome10.jpg" }
                        ].map((room, i) => (
                            <FadeUp key={room.title} delay={i * 0.1}>
                                <div className="group cursor-pointer">
                                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-8 shadow-sm">
                                        <motion.img
                                            src={room.img}
                                            alt={room.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                                    </div>
                                    <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1613] mb-3">{room.title}</h3>
                                    <p className="text-stone-500 text-base leading-relaxed mb-6">{room.desc}</p>
                                    <div className="flex gap-4 text-stone-400">
                                        <div className="flex items-center gap-1.5 text-xs tracking-widest uppercase"><Bed className="w-4 h-4" /> King Size</div>
                                        <div className="flex items-center gap-1.5 text-xs tracking-widest uppercase"><Bath className="w-4 h-4" /> En-suite</div>
                                    </div>
                                </div>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                § 4 — THE AMENITIES (Icon grid)
            ══════════════════════════════════════════════════════ */}
            <section id="amenities" className="py-32 sm:py-48 border-y border-stone-200 bg-white">
                <div className="max-w-7xl mx-auto px-6 sm:px-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-24">
                        <div className="max-w-xl">
                            <FadeUp>
                                <p className="text-[#1C1613]/40 text-xs tracking-[0.4em] uppercase mb-8">Chapter IV — The Essentials</p>
                                <h2 className="font-serif text-4xl sm:text-6xl font-light text-[#1C1613] leading-[1.1]">
                                    Everything you need,<br />
                                    <em className="text-amber-600 not-italic">nothing you don't.</em>
                                </h2>
                            </FadeUp>
                        </div>
                        <FadeUp delay={0.2}>
                            <button
                                onClick={handleBookNow}
                                className="px-10 py-5 bg-[#1C1613] text-white rounded-full text-sm tracking-widest uppercase font-semibold hover:bg-amber-900 transition-all shadow-xl shadow-stone-200"
                            >
                                View All Features
                            </button>
                        </FadeUp>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                        {AMENITIES.map((item, i) => (
                            <FadeUp key={item.label} delay={i * 0.05}>
                                <div className="space-y-4">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700">
                                        <item.icon strokeWidth={1.5} className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-[#1C1613] text-lg mb-1">{item.label}</h4>
                                        <p className="text-stone-400 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Section */
            }
            {/* Gallery Section */}
            {/*<section id="gallery"*/}
            {/*         className="py-12 sm:py-16 md:py-20 max-w-6xl mx-auto px-4 sm:px-6 rounded-xl shadow-lg my-8 sm:my-12 bg-amber-50 border border-amber-100"*/}
            {/*         data-aos="fade-up">*/}
            {/*    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 md:mb-16 text-amber-900">Explore*/}
            {/*        Our Spaces</h2>*/}

            {/*    /!* Room Types - Desktop: 2x2 grid, Mobile: 1 column *!/*/}
            {/*    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 md:mb-12">*/}
            {/*        {[*/}
            {/*            {*/}
            {/*                id: "deluxe-double",*/}
            {/*                title: "Deluxe Double Room",*/}
            {/*                coverImage: "./dhome.jpg",*/}
            {/*                images: [*/}
            {/*                    "./dhome.jpg",*/}
            {/*                    "./dhome11.jpg",*/}
            {/*                    "./dhome9.jpg",*/}
            {/*                    "./dhome16.jpg",*/}
            {/*                    "./dhome1.jpg",*/}
            {/*                    "./banjo6.jpg",*/}
            {/*                    "./banjo8.jpg",*/}
            {/*                    "./jasht9.jpg",*/}
            {/*                    "./kuzhin77.jpg",*/}

            {/*                ]*/}
            {/*            },*/}
            {/*            {*/}
            {/*                id: "deluxe-double-balcony",*/}
            {/*                title: "Deluxe Double Room with Balcony",*/}
            {/*                coverImage: "./dhome4.jpg",*/}
            {/*                images: [*/}
            {/*                    "./dhome4.jpg",*/}
            {/*                    "./dhome17.jpg",*/}
            {/*                    "./dhome5.jpg",*/}
            {/*                    "./dhome24.jpg",*/}
            {/*                    "./dhome6.jpg",*/}
            {/*                    "./banjo7.jpg",*/}
            {/*                    "./banjo1.jpg",*/}
            {/*                    "./banjo3.jpg",*/}
            {/*                    "./dhome13.jpg",*/}
            {/*                    "./dhome20.jpg",*/}
            {/*                    "./kuzhin79.jpg",*/}

            {/*                ]*/}
            {/*            },*/}
            {/*            {*/}
            {/*                id: "triple-garden",*/}
            {/*                title: "Triple Room with Garden View",*/}
            {/*                coverImage: "./dhome3.jpg",*/}
            {/*                images: [*/}
            {/*                    "./dhome3.jpg",*/}
            {/*                    "./dhome21.jpg",*/}
            {/*                    "./dhome22.jpg",*/}
            {/*                    "./dhome23.jpg",*/}
            {/*                    "./dhome8.jpg",*/}
            {/*                    "./banjo2.jpg",*/}
            {/*                    "./dhome25.jpg",*/}
            {/*                    "./jasht2.jpg",*/}
            {/*                    "./kuzhin2.jpg",*/}

            {/*                ]*/}
            {/*            },*/}
            {/*            {*/}
            {/*                id: "family-suite",*/}
            {/*                title: "Deluxe Family Suite",*/}
            {/*                coverImage: "./dhome10.jpg",*/}
            {/*                images: [*/}
            {/*                    "./dhome10.jpg",*/}
            {/*                    "./dhome71.jpg",*/}
            {/*                    "./dhome73.jpg",*/}
            {/*                    "./dhome75.jpg",*/}
            {/*                    "./dhome74.jpg",*/}
            {/*                    "./dhome12.jpg",*/}
            {/*                    "./dhome15.jpg",*/}
            {/*                    "./dhome76.jpg",*/}
            {/*                    "./banjo5.jpg",*/}
            {/*                    "./banjo8.jpg",*/}
            {/*                    "./banjo9.jpg",*/}
            {/*                    "./kuzhin.jpg",*/}


            {/*                ]*/}
            {/*            }*/}
            {/*        ].map((g, i) => (*/}
            {/*            <div*/}
            {/*                key={g.id}*/}
            {/*                className="relative group cursor-pointer rounded-lg sm:rounded-xl overflow-hidden shadow-md h-48 sm:h-64 md:h-80"*/}
            {/*                onClick={() => {*/}
            {/*                    setLightboxState({*/}
            {/*                        open: true,*/}
            {/*                        index: 0,*/}
            {/*                        images: g.images*/}
            {/*                    });*/}
            {/*                }}*/}
            {/*                data-aos="fade-up"*/}
            {/*                data-aos-delay={i * 100}*/}
            {/*            >*/}
            {/*                <div*/}
            {/*                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"*/}
            {/*                    style={{backgroundImage: `url(${g.coverImage})`}}*/}
            {/*                />*/}
            {/*                <div*/}
            {/*                    className="absolute inset-0 bg-amber-900/40 group-hover:bg-amber-900/60 transition-opacity duration-300"/>*/}
            {/*                <div className="absolute inset-0 flex items-center justify-center z-10">*/}
            {/*                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-50 drop-shadow-lg">{g.title}</h3>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        ))}*/}
            {/*    </div>*/}

            {/*    /!* Outdoor Section - Full width in both desktop and mobile *!/*/}
            {/*    <div*/}
            {/*        className="relative group cursor-pointer rounded-lg sm:rounded-xl overflow-hidden shadow-md h-48 sm:h-64 md:h-80 w-full"*/}
            {/*        onClick={() => {*/}
            {/*            setLightboxState({*/}
            {/*                open: true,*/}
            {/*                index: 0,*/}
            {/*                images: [*/}
            {/*                    "./jasht1.jpg",*/}
            {/*                    "./jasht3.jpg",*/}
            {/*                    "./jasht4.jpg",*/}
            {/*                    "./jasht5.jpg",*/}
            {/*                    "./jasht6.jpg",*/}
            {/*                    "./jasht7.jpg",*/}
            {/*                    "./jasht8.jpg"*/}
            {/*                ]*/}
            {/*            });*/}
            {/*        }}*/}
            {/*        data-aos="fade-up"*/}
            {/*    >*/}
            {/*        <div*/}
            {/*            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"*/}
            {/*            style={{backgroundImage: "url('./jasht1.jpg')"}}*/}
            {/*        />*/}
            {/*        <div*/}
            {/*            className="absolute inset-0 bg-amber-900/40 group-hover:bg-amber-900/60 transition-opacity duration-300"/>*/}
            {/*        <div className="absolute inset-0 flex items-center justify-center z-10">*/}
            {/*            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-50 drop-shadow-lg">Outdoor*/}
            {/*                Spaces</h3>*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*    <Lightbox*/}
            {/*        open={lightboxState.open}*/}
            {/*        close={() => setLightboxState({...lightboxState, open: false})}*/}
            {/*        index={lightboxState.index}*/}
            {/*        slides={lightboxState.images.map(img => ({src: img}))}*/}
            {/*        controller={{*/}
            {/*            closeOnBackdropClick: true,*/}
            {/*            closeOnPullDown: true,*/}
            {/*        }}*/}
            {/*        render={{*/}
            {/*            iconPrev: () => <ChevronLeft size={isMobile ? 32 : 48} className="text-amber-700"/>,*/}
            {/*            iconNext: () => <ChevronRight size={isMobile ? 32 : 48} className="text-amber-700"/>,*/}
            {/*            iconClose: () => <X size={isMobile ? 24 : 32} className="text-amber-700"/>,*/}
            {/*        }}*/}
            {/*    />*/}
            {/*</section>*/}
            {/* ══════════════════════════════════════════════════════
                § 5 — THE GALLERY (Interactive stack)
            ══════════════════════════════════════════════════════ */}
            <section id="gallery" className="py-32 sm:py-48 bg-[#130E0A] overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 sm:px-12 text-center mb-24">
                    <FadeUp>
                        <p className="text-amber-400/70 text-xs tracking-[0.4em] uppercase mb-8">Chapter V — The Perspective</p>
                        <h2 className="font-serif text-5xl sm:text-7xl font-light text-white leading-tight">
                            Captured<br />
                            <em className="text-amber-400 not-italic">Moments.</em>
                        </h2>
                    </FadeUp>
                </div>

                <div className="flex flex-col items-center gap-24">
                    {/* Featured collection */}
                    <FadeUp className="w-full flex justify-center">
                        <div className="h-[400px] sm:h-[600px] w-full max-w-4xl">
                            <BounceCards
                                className="custom-bounce-cards"
                                images={GALLERY_IMAGES}
                                containerSize={isMobile ? 350 : 600}
                                transformStyles={[
                                    "rotate(10deg) translate(-150px, -100px)",
                                    "rotate(-5deg) translate(120px, -120px)",
                                    "rotate(8deg) translate(-100px, 150px)",
                                    "rotate(-10deg) translate(140px, 160px)",
                                    "rotate(2deg) translate(0px, 0px)"
                                ]}
                            />
                        </div>
                    </FadeUp>

                    {/* Category Stacks */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-6 px-6 sm:px-12 w-full max-w-7xl">
                        {galleryData.map((category, idx) => (
                            <FadeUp key={category.id} delay={idx * 0.1} className="flex flex-col items-center">
                                <div
                                    className="relative w-48 h-64 mb-12 cursor-pointer"
                                    onClick={() => setLightboxState({ open: true, index: 0, images: category.images })}
                                >
                                    <Stack
                                        randomRotation={true}
                                        sensitivity={180}
                                        sendToBackOnClick={true}
                                        cardDimensions={{ width: 192, height: 256 }}
                                        cardsData={category.images.slice(0, 5).map(img => ({ id: img, img }))}
                                    />
                                    <div className="absolute -bottom-4 inset-x-0 text-center">
                                        <span className="bg-amber-400 text-[#1C1613] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-lg">
                                            {category.images.length} Photos
                                        </span>
                                    </div>
                                </div>
                                <h4 className="font-serif text-xl font-medium text-white">{category.title}</h4>
                            </FadeUp>
                        ))}
                    </div>
                </div>

                {/* Lightbox placeholder/trigger for stack */}
                <AnimatePresence>
                    {lightboxState.open && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 sm:p-12"
                        >
                            <button
                                onClick={() => setLightboxState({ ...lightboxState, open: false })}
                                className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2"
                            >
                                <X className="w-8 h-8" />
                            </button>

                            <div className="w-full max-w-5xl aspect-video relative group">
                                <img
                                    src={lightboxState.images[lightboxState.index]}
                                    alt="Gallery preview"
                                    className="w-full h-full object-contain"
                                />

                                {/* Navigation */}
                                <button
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => setLightboxState(prev => ({
                                        ...prev,
                                        index: (prev.index - 1 + prev.images.length) % prev.images.length
                                    }))}
                                >
                                    <ChevronLeft />
                                </button>
                                <button
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => setLightboxState(prev => ({
                                        ...prev,
                                        index: (prev.index + 1) % prev.images.length
                                    }))}
                                >
                                    <ChevronRight />
                                </button>

                                <div className="absolute -bottom-12 left-0 right-0 text-center">
                                    <p className="text-white/40 text-xs tracking-widest uppercase">
                                        Image {lightboxState.index + 1} of {lightboxState.images.length}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* ══════════════════════════════════════════════════════
                § 6 — THE GUEST BOOK (Reviews)
            ══════════════════════════════════════════════════════ */}
            <section id="reviews" className="py-32 sm:py-48 bg-[#F9F6F1] overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 sm:px-12">
                    <div className="grid lg:grid-cols-3 gap-24 items-start">

                        {/* Left — title and form */}
                        <div className="lg:sticky lg:top-32 space-y-12">
                            <div>
                                <FadeUp>
                                    <p className="text-[#1C1613]/40 text-xs tracking-[0.4em] uppercase mb-8">Chapter VI — The Voice</p>
                                    <h2 className="font-serif text-4xl sm:text-6xl font-light text-[#1C1613] leading-none mb-8">
                                        Stories from<br />
                                        <em className="text-amber-600 not-italic">our Guests.</em>
                                    </h2>
                                    <p className="text-stone-500 text-lg font-light leading-relaxed">
                                        We believe the best tellers of our story are those who have lived it.
                                    </p>
                                </FadeUp>
                            </div>

                            {/* Add Review Sidebar */}
                            <FadeUp delay={0.2}>
                                <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
                                    <h4 className="font-serif text-xl text-[#1C1613] mb-6">Leave your mark</h4>
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            value={newReview.name}
                                            onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                                            className="w-full px-5 py-3 rounded-2xl bg-stone-50 border-none text-sm focus:ring-2 focus:ring-amber-200 transition-all"
                                        />
                                        <Select
                                            options={COUNTRY_OPTIONS}
                                            placeholder="Your Country"
                                            value={COUNTRY_OPTIONS.find(c => c.value === newReview.country)}
                                            onChange={(opt: any) => setNewReview({ ...newReview, country: opt?.label })}
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    borderRadius: '1rem',
                                                    padding: '0.25rem',
                                                    border: 'none',
                                                    backgroundColor: '#f8fafc',
                                                    fontSize: '0.875rem'
                                                })
                                            }}
                                        />
                                        <div className="flex gap-2 py-2">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button key={star} onClick={() => setNewReview({ ...newReview, rating: star })}>
                                                    <Star className={`w-6 h-6 ${newReview.rating >= star ? "text-amber-400 fill-amber-400" : "text-stone-200"}`} />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            placeholder="Share your experience..."
                                            value={newReview.comment}
                                            onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                                            rows={4}
                                            className="w-full px-5 py-3 rounded-2xl bg-stone-50 border-none text-sm focus:ring-2 focus:ring-amber-200 transition-all"
                                        />
                                        <button
                                            onClick={handleAddReview}
                                            className="w-full py-4 bg-amber-600 text-white rounded-2xl text-xs font-bold tracking-[0.2em] uppercase hover:bg-amber-700 transition-all"
                                        >
                                            Publish Note
                                        </button>
                                    </div>
                                </div>
                            </FadeUp>
                        </div>

                        {/* Right — Scrolling carousel of reviews */}
                        <div className="lg:col-span-2 space-y-8">
                            {reviews.length === 0 ? (
                                <div className="h-64 flex items-center justify-center border-2 border-dashed border-stone-200 rounded-3xl text-stone-300 uppercase tracking-widest text-xs">
                                    Waiting for the first story...
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {reviews.map((rev, i) => (
                                        <FadeUp key={i} delay={i * 0.1}>
                                            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        <h5 className="font-serif text-lg text-[#1C1613]">{rev.name}</h5>
                                                        <p className="text-stone-400 text-xs uppercase tracking-widest">{rev.country}</p>
                                                    </div>
                                                    <div className="flex">
                                                        {renderStars(rev.rating)}
                                                    </div>
                                                </div>
                                                <p className="text-stone-500 font-light leading-relaxed italic">"{rev.comment}"</p>
                                                <div className="mt-6 pt-6 border-t border-stone-50">
                                                    <p className="text-stone-300 text-[10px] uppercase tracking-widest">{rev.date}</p>
                                                </div>
                                            </div>
                                        </FadeUp>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                § 7 — THE FOOTER (Final notes)
            ══════════════════════════════════════════════════════ */}
            <footer className="bg-[#1C1613] text-white pt-32 pb-16">
                <div className="max-w-7xl mx-auto px-6 sm:px-12">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">

                        {/* Brand */}
                        <div className="space-y-8">
                            <h3 className="font-serif text-3xl font-light">Villa<br /><span className="text-amber-400">Safira</span></h3>
                            <p className="text-white/40 text-sm leading-loose max-w-xs">
                                A boutique retreat in Durrës, where the warmth of Albanian hospitality meets the calm of the Adriatic shore.
                            </p>
                        </div>

                        {/* Navigation */}
                        <div className="space-y-8">
                            <h4 className="text-xs tracking-[0.3em] uppercase text-white/40">Navigation</h4>
                            <ul className="space-y-4">
                                {NAV_LINKS.map(link => (
                                    <li key={link}>
                                        <button
                                            onClick={() => scrollTo(link)}
                                            className="text-white/70 hover:text-amber-400 text-sm uppercase tracking-widest transition-colors"
                                        >
                                            {link}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="space-y-8">
                            <h4 className="text-xs tracking-[0.3em] uppercase text-white/40">Contact</h4>
                            <div className="space-y-6">
                                <a href="mailto:villasafiradurres@gmail.com" className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-[#1C1613] transition-all">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm text-white/70 group-hover:text-white transition-colors">villasafiradurres@gmail.com</span>
                                </a>
                                <div className="flex items-center gap-4 group cursor-pointer" onClick={openWhatsApp}>
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-[#1C1613] transition-all">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm text-white/70 group-hover:text-white transition-colors">+355 69 242 9567</span>
                                </div>
                                <a href="https://maps.app.goo.gl/hZa8t1TER1ymqn338" target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-[#1C1613] transition-all">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm text-white/70 group-hover:text-white transition-colors">Durrës, Albania</span>
                                </a>
                            </div>
                        </div>

                        {/* Social/Status */}
                        <div className="space-y-8">
                            <h4 className="text-xs tracking-[0.3em] uppercase text-white/40">Newsletter</h4>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full bg-white/5 border-b border-white/10 py-4 text-sm focus:border-amber-400 outline-none transition-all"
                                />
                                <button className="absolute right-0 top-1/2 -translate-y-1/2 text-amber-400 text-xs uppercase tracking-widest font-bold">Join</button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-8">
                        <p className="text-white/20 text-[10px] tracking-[0.3em] uppercase">
                            © {new Date().getFullYear()} Villa Safira · Albania
                        </p>
                        <div className="flex gap-8">
                            {["Instagram", "Facebook", "Booking"].map(soc => (
                                <button key={soc} className="text-white/20 hover:text-white transition-colors text-[10px] tracking-[0.3em] uppercase">
                                    {soc}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;
