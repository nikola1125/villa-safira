import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
// @ts-ignore
import countryList from "react-select-country-list";
import {
    Bath, Bed, Calendar, Car, Clock, Coffee,
    MapPin, Phone, Shield, Star, StarOff, Sun,
    TreePine, Users, Utensils, Wifi, X, ChevronDown, Mail
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
    const [lightboxState, setLightboxState] = useState({ open: false, index: 0, images: [] as string[] });
    const [reviews, setReviews] = useState<Review[]>(() => JSON.parse(localStorage.getItem("reviews") || "[]"));
    const [newReview, setNewReview] = useState({ name: "", country: "", comment: "", rating: 5 });

    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 900], [0, 380]);
    const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
    const heroScale = useTransform(scrollY, [0, 800], [1, 1.08]);

    useMotionValueEvent(scrollY, "change", v => setIsScrolled(v > 60));

    useEffect(() => {
        const preventZoom = (e: TouchEvent) => { if (e.touches.length > 1) e.preventDefault(); };
        document.addEventListener("touchmove", preventZoom, { passive: false });
        const onResize = () => setIsMobile(window.innerWidth < 768);
        onResize();
        window.addEventListener("resize", onResize);
        return () => {
            document.removeEventListener("touchmove", preventZoom);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const r = await apiClient.get("/api/reviews");
                setReviews(r.data);
            } catch {
                setReviews(JSON.parse(localStorage.getItem("reviews") || "[]"));
            }
        })();
    }, []);

    const openWhatsApp = () => window.open(`https://wa.me/+355692429567?text=${encodeURIComponent("Hello, I have a question about Villa Safira.")}`, "_blank");
    const handleBookNow = () => window.open("https://www.booking.com/hotel/al/villa-sol-durres.html", "_blank");

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setIsMenuOpen(false);
    };

    const handleAddReview = async () => {
        if (!newReview.name || !newReview.country || !newReview.comment) return;
        try {
            const r = await apiClient.post("/api/reviews", newReview);
            const updated = [r.data, ...reviews];
            setReviews(updated);
            localStorage.setItem("reviews", JSON.stringify(updated));
        } catch {
            const saved = { ...newReview, date: new Date().toLocaleDateString() };
            const updated = [saved, ...reviews];
            setReviews(updated);
            localStorage.setItem("reviews", JSON.stringify(updated));
        }
        setNewReview({ name: "", country: "", comment: "", rating: 5 });
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
        <div className="bg-[#F9F6F1] text-[#1C1613] font-sans selection:bg-amber-200 overflow-x-hidden w-full relative">

            {/* ──────── VIEWPORT META ──────────────────────────────── */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

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
                § 3 — ROOMS (light, editorial)
            ══════════════════════════════════════════════════════ */}
            <section id="rooms" className="py-32 sm:py-48 bg-[#F9F6F1]">
                <div className="max-w-7xl mx-auto px-6 sm:px-12">
                    <FadeUp className="mb-4">
                        <p className="text-amber-700/60 text-xs tracking-[0.4em] uppercase">Chapter III</p>
                    </FadeUp>
                    <MaskReveal className="mb-20 sm:mb-32">
                        <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-[#1C1613]">
                            Your Room Awaits
                        </h2>
                    </MaskReveal>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {[
                            { img: "./dhome1.jpg", name: "Deluxe Double", desc: "A haven of calm with refined finishes, garden views, and everything you need to feel at home.", badge: "Most Popular" },
                            { img: "./dhome5.jpg", name: "Double with Balcony", desc: "Step onto your private balcony each morning — sea breeze, coffee in hand, the day wide open.", badge: "Sea Breeze" },
                            { img: "./dhome8.jpg", name: "Triple Garden View", desc: "Spacious comfort for small families or friends, surrounded by lush garden views.", badge: "Garden View" },
                            { img: "./dhome11.jpg", name: "Family Suite", desc: "Generous space designed with families in mind — every detail considered, every comfort provided.", badge: "Family Retreat" },
                            { img: "./jasht3.jpg", name: "Garden Terrace", desc: "Unwind in our lush garden with the gentle hum of cicadas and flickering afternoon light.", badge: "Outdoor Bliss" },
                        ].map((room, i) => (
                            <FadeUp key={i} delay={i * 0.08}>
                                <motion.div
                                    whileHover={{ y: -8 }}
                                    transition={{ duration: 0.5 }}
                                    className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-700 cursor-pointer"
                                    onClick={() => {
                                        if (i < GALLERY_DATA.length) {
                                            setLightboxState({ open: true, index: i, images: GALLERY_DATA[i].images });
                                        }
                                    }}
                                >
                                    <div className="aspect-[4/3] overflow-hidden">
                                        <motion.img
                                            src={room.img}
                                            alt={room.name}
                                            className="w-full h-full object-cover"
                                            whileHover={{ scale: 1.08 }}
                                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                        />
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <span className="text-xs tracking-widest uppercase bg-white/90 text-[#1C1613] font-semibold px-3 py-1 rounded-full">
                                            {room.badge}
                                        </span>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-serif text-xl text-[#1C1613] mb-2">{room.name}</h3>
                                        <p className="text-stone-500 text-sm leading-relaxed mb-4">{room.desc}</p>
                                        <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold group-hover:text-amber-700 transition-colors">
                                            <span className="tracking-widest uppercase">View Photos</span>
                                            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </FadeUp>
                        ))}

                        {/* Book CTA card */}
                        <FadeUp delay={0.4}>
                            <motion.div
                                whileHover={{ y: -8 }}
                                transition={{ duration: 0.5 }}
                                className="group relative bg-[#1C1613] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-700 flex flex-col justify-center items-center p-10 text-center min-h-[200px]"
                            >
                                <p className="text-amber-400/70 text-xs tracking-[0.3em] uppercase mb-4">Reserve Yours</p>
                                <h3 className="font-serif text-white text-2xl mb-6">Start Planning<br />Your Stay</h3>
                                <button
                                    onClick={handleBookNow}
                                    className="px-6 py-3 bg-white text-[#1C1613] text-xs tracking-widest uppercase font-bold rounded-full hover:bg-amber-50 transition-colors"
                                >
                                    Check Availability
                                </button>
                            </motion.div>
                        </FadeUp>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                § 4 — FULL SCREEN STATEMENT BREAK
            ══════════════════════════════════════════════════════ */}
            <section className="relative h-[70vh] sm:h-screen overflow-hidden flex items-center justify-center">
                <div className={`absolute inset-0 bg-cover bg-center ${!isMobile ? 'bg-fixed' : ''}`} style={{ backgroundImage: "url('/jasht2.jpg')" }} />
                <div className="absolute inset-0 bg-[#130E0A]/60" />
                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <MaskReveal>
                        <p className="font-serif text-white text-3xl sm:text-5xl md:text-6xl font-light leading-relaxed">
                            "Breakfast on the terrace.<br />
                            <em className="text-amber-400">Salt air through the window.</em><br />
                            No alarm. No rush."
                        </p>
                    </MaskReveal>
                    <FadeUp delay={0.5} className="mt-10">
                        <p className="text-white/50 text-sm tracking-[0.3em] uppercase">This is your life at Villa Safira</p>
                    </FadeUp>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                § 5 — AMENITIES (dark, premium grid)
            ══════════════════════════════════════════════════════ */}
            <section id="amenities" className="bg-[#130E0A] text-white py-32 sm:py-48">
                <div className="max-w-7xl mx-auto px-6 sm:px-12">
                    <FadeUp className="mb-4">
                        <p className="text-amber-400/70 text-xs tracking-[0.4em] uppercase">Chapter IV — The Details</p>
                    </FadeUp>
                    <MaskReveal className="mb-20 sm:mb-32">
                        <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light">
                            Every Comfort,<br />
                            <em className="text-amber-400 not-italic">Considered.</em>
                        </h2>
                    </MaskReveal>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-white/5 rounded-3xl overflow-hidden">
                        {AMENITIES.map((a, i) => (
                            <FadeUp key={i} delay={i * 0.04}>
                                <motion.div
                                    whileHover={{ backgroundColor: "rgba(180, 120, 30, 0.08)" }}
                                    className="group p-8 sm:p-10 bg-[#130E0A] flex flex-col gap-4 transition-colors duration-300 cursor-default"
                                >
                                    <a.icon className="w-7 h-7 text-amber-400/80 group-hover:text-amber-400 transition-colors" />
                                    <div>
                                        <p className="font-semibold text-white text-sm sm:text-base tracking-wide mb-1">{a.label}</p>
                                        <p className="text-white/40 text-xs sm:text-sm leading-relaxed">{a.desc}</p>
                                    </div>
                                </motion.div>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                § 6 — GALLERY (bounce cards, light section)
            ══════════════════════════════════════════════════════ */}
            <section id="gallery" className="py-32 sm:py-48 bg-[#F9F6F1]">
                <div className="max-w-7xl mx-auto px-6 sm:px-12">
                    <FadeUp className="mb-4">
                        <p className="text-amber-700/60 text-xs tracking-[0.4em] uppercase">Chapter V</p>
                    </FadeUp>
                    <MaskReveal className="mb-6">
                        <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-[#1C1613]">
                            Explore the Spaces
                        </h2>
                    </MaskReveal>
                    <FadeUp delay={0.3} className="mb-16 sm:mb-24">
                        <p className="text-stone-500 text-base sm:text-lg max-w-xl">
                            Hover to fan the cards apart. Click to step inside.
                        </p>
                    </FadeUp>
                </div>

                <FadeUp delay={0.2}>
                    <div className="flex justify-center items-center py-10 overflow-visible">
                        <BounceCards
                            className="custom-bounceCards"
                            images={GALLERY_IMAGES}
                            titles={GALLERY_TITLES}
                            containerWidth={isMobile ? "100%" : 800}
                            containerHeight={isMobile ? 450 : 600}
                            animationDelay={0.5}
                            animationStagger={0.08}
                            easeType="elastic.out(1, 0.5)"
                            enableHover={true}
                            hoverPushOffset={isMobile ? 130 : 220}
                            transformStyles={isMobile
                                ? ["rotate(10deg) translate(-150px)", "rotate(5deg) translate(-75px)", "rotate(-3deg)", "rotate(-10deg) translate(75px)", "rotate(2deg) translate(150px)"]
                                : ["rotate(10deg) translate(-260px)", "rotate(5deg) translate(-130px)", "rotate(-3deg)", "rotate(-10deg) translate(130px)", "rotate(2deg) translate(260px)"]
                            }
                            onCardClick={(idx) => setLightboxState({ open: true, index: idx, images: GALLERY_DATA[idx].images })}
                        />
                    </div>
                </FadeUp>

                {/* Gallery lightbox */}
                <AnimatePresence>
                    {lightboxState.open && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-2xl"
                        >
                            <button
                                onClick={() => setLightboxState(p => ({ ...p, open: false }))}
                                className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-[210]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <motion.div
                                initial={{ scale: 0.85, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.85, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                                className="w-full max-w-3xl h-[60vh] flex items-center justify-center px-4"
                            >
                                <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-[420px] md:h-[420px]">
                                    <Stack
                                        randomRotation={true}
                                        sensitivity={200}
                                        sendToBackOnClick={true}
                                        cards={lightboxState.images.map((src, i) => (
                                            <img key={i} src={src} alt={`photo-${i + 1}`}
                                                className="w-full h-full object-cover rounded-2xl border-4 border-white shadow-2xl"
                                            />
                                        ))}
                                    />
                                </div>
                            </motion.div>
                            <div className="absolute bottom-10 text-center text-white px-4">
                                <p className="font-serif text-xl mb-1">{GALLERY_DATA[lightboxState.index]?.title}</p>
                                <p className="text-white/50 text-sm">Tap cards to browse photos</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* ══════════════════════════════════════════════════════
                § 7 — REVIEWS (dark, horizontal scroll)
            ══════════════════════════════════════════════════════ */}
            <section id="reviews" className="bg-[#130E0A] text-white py-32 sm:py-48">
                <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-16 sm:mb-24">
                    <FadeUp className="mb-4">
                        <p className="text-amber-400/70 text-xs tracking-[0.4em] uppercase">Chapter VI</p>
                    </FadeUp>
                    <MaskReveal>
                        <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light">
                            Our Guests <em className="text-amber-400 not-italic">Speak.</em>
                        </h2>
                    </MaskReveal>
                </div>

                {/* Horizontal scroll reviews */}
                {reviews.length === 0 ? (
                    <div className="text-center text-white/40 py-12">No reviews yet — be the first!</div>
                ) : (
                    <div className="relative px-6 sm:px-12">
                        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#130E0A] to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#130E0A] to-transparent z-10 pointer-events-none" />
                        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 css-hide-scrollbar">
                            {reviews.map((r, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 60 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.7, delay: Math.min(i * 0.1, 0.6) }}
                                    className="snap-center shrink-0 w-[85vw] sm:w-[420px] bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-10 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="text-5xl font-serif text-amber-400/30 leading-none mb-6">"</div>
                                        <p className="text-white/80 text-base sm:text-lg leading-relaxed italic mb-8 line-clamp-5">
                                            {r.comment}
                                        </p>
                                    </div>
                                    <div className="border-t border-white/10 pt-5">
                                        {renderStars(r.rating)}
                                        <p className="font-semibold text-white mt-3">{r.name}</p>
                                        <p className="text-white/40 text-xs mt-1 flex justify-between">
                                            <span>{r.country}</span><span>{r.date}</span>
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Review form */}
                <div className="max-w-3xl mx-auto px-6 sm:px-12 mt-20 sm:mt-32">
                    <FadeUp className="mb-10">
                        <h3 className="font-serif text-3xl sm:text-4xl text-white font-light">
                            Share Your Experience
                        </h3>
                    </FadeUp>
                    <FadeUp delay={0.1}>
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={newReview.name}
                                onChange={e => setNewReview(p => ({ ...p, name: e.target.value }))}
                                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50 transition-colors text-sm"
                            />
                            <Select
                                options={COUNTRY_OPTIONS}
                                placeholder="Your Country"
                                value={COUNTRY_OPTIONS.find((c: any) => c.value === newReview.country) || null}
                                onChange={(opt: any) => setNewReview(p => ({ ...p, country: opt?.value }))}
                                styles={{
                                    control: (p) => ({ ...p, backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.75rem", padding: "0.5rem", boxShadow: "none", "&:hover": { borderColor: "rgba(251,191,36,0.5)" } }),
                                    menu: (p) => ({ ...p, backgroundColor: "#1C1613", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.75rem" }),
                                    option: (p, s) => ({ ...p, backgroundColor: s.isSelected ? "rgba(251,191,36,0.2)" : "transparent", color: "rgba(255,255,255,0.8)", "&:hover": { backgroundColor: "rgba(255,255,255,0.05)" } }),
                                    placeholder: (p) => ({ ...p, color: "rgba(255,255,255,0.3)", fontSize: "0.875rem" }),
                                    singleValue: (p) => ({ ...p, color: "white" }),
                                    input: (p) => ({ ...p, color: "white" }),
                                }}
                            />
                        </div>
                        <textarea
                            placeholder="Tell future guests what made your stay special..."
                            value={newReview.comment}
                            onChange={e => setNewReview(p => ({ ...p, comment: e.target.value }))}
                            rows={4}
                            className="w-full mb-4 px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50 transition-colors text-sm resize-none"
                        />
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <span className="text-white/50 text-sm">Rating</span>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <button key={i} onClick={() => setNewReview(p => ({ ...p, rating: i }))}>
                                            <Star
                                                className={`w-6 h-6 transition-all hover:scale-110 ${newReview.rating >= i ? "text-amber-400 fill-amber-400" : "text-white/20"}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={handleAddReview}
                                className="group relative overflow-hidden px-8 py-3 rounded-full bg-amber-500 text-[#1C1613] font-bold text-sm tracking-widest uppercase hover:bg-amber-400 transition-colors w-full sm:w-auto"
                            >
                                Submit Review
                            </button>
                        </div>
                    </FadeUp>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                § 8 — FULL-SCREEN BOOK CTA
            ══════════════════════════════════════════════════════ */}
            <section className="relative h-screen overflow-hidden flex items-center justify-center bg-black">
                <div className={`absolute inset-0 bg-cover bg-center opacity-40 ${!isMobile ? 'bg-fixed' : ''}`} style={{ backgroundImage: "url('/jasht3.jpg')" }} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <MaskReveal className="mb-6">
                        <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-4">Your Story Begins Here</p>
                        <h2 className="font-serif text-6xl sm:text-7xl md:text-8xl text-white font-light leading-none">
                            Ready to Arrive?
                        </h2>
                    </MaskReveal>
                    <FadeUp delay={0.4} className="mb-12">
                        <p className="text-white/60 text-lg sm:text-xl font-light max-w-xl mx-auto">
                            Reserve your room today and begin your Albanian coastal escape.
                        </p>
                    </FadeUp>
                    <FadeUp delay={0.6}>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleBookNow}
                                className="px-10 py-5 bg-amber-500 text-[#1C1613] font-bold text-sm tracking-widest uppercase rounded-full hover:bg-amber-400 transition-all duration-300 hover:scale-105"
                            >
                                Book on Booking.com
                            </button>
                            <button
                                onClick={openWhatsApp}
                                className="px-10 py-5 border border-white/40 text-white font-medium text-sm tracking-widest uppercase rounded-full hover:bg-white/10 transition-all duration-300"
                            >
                                Contact Us Directly
                            </button>
                        </div>
                    </FadeUp>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                FOOTER
            ══════════════════════════════════════════════════════ */}
            <footer className="bg-[#0D0A07] text-white">
                <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24 grid sm:grid-cols-3 gap-12">
                    <div>
                        <p className="font-serif text-2xl tracking-widest uppercase font-bold text-white mb-4">Villa Safira</p>
                        <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                            A boutique retreat on Albania's Adriatic coast. Four rooms. Infinite calm.
                        </p>
                    </div>
                    <div>
                        <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-5">Navigate</p>
                        <ul className="space-y-3">
                            {NAV_LINKS.map(link => (
                                <li key={link}>
                                    <button
                                        onClick={() => scrollTo(link)}
                                        className="text-white/60 text-sm hover:text-amber-400 tracking-wide capitalize transition-colors"
                                    >
                                        {link}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-5">Contact</p>
                        <div className="space-y-4">
                            <a href="https://maps.app.goo.gl/hZa8t1TER1ymqn338" target="_blank" rel="noopener noreferrer"
                                className="flex items-start gap-3 text-white/60 hover:text-amber-400 transition-colors text-sm">
                                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
                                <span>Durrës, Albania<br />Adriatic Coast</span>
                            </a>
                            <a href="mailto:villasafiradurres@gmail.com"
                                className="flex items-center gap-3 text-white/60 hover:text-amber-400 transition-colors text-sm">
                                <Mail className="w-4 h-4 shrink-0 text-amber-500" />
                                villasafiradurres@gmail.com
                            </a>
                            <button onClick={openWhatsApp}
                                className="flex items-center gap-3 text-white/60 hover:text-amber-400 transition-colors text-sm">
                                <Phone className="w-4 h-4 shrink-0 text-amber-500" />
                                +355 69 242 9567
                            </button>
                        </div>
                    </div>
                </div>
                <div className="border-t border-white/5 px-6 sm:px-12 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/20 text-xs tracking-widest uppercase">
                    <span>© {new Date().getFullYear()} Villa Safira. All rights reserved.</span>
                    <span>Durrës · Albania · Adriatic</span>
                </div>
            </footer>

        </div>
    );
};

export default App;