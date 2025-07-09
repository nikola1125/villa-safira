import React, {useEffect, useState} from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Select from "react-select";
// @ts-ignore
import countryList from "react-select-country-list";
import {
    Bath,
    Bed,
    Calendar,
    Car, Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    Coffee,
    Mail,
    MapPin,
    Shield,
    Star,
    StarOff,
    Sun,
    TreePine,
    Users,
    Utensils,
    Wifi,
    X
} from "lucide-react";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

interface GalleryItem {
    id: string;
    title: string;
    coverImage: string;
    images: string[];
}

interface Review {
    name: string;
    country: string;
    comment: string;
    rating: number;
    date: string;
}

const App: React.FC = () => {
    const [scrollY, setScrollY] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [newReview, setNewReview] = useState({
        name: "",
        country: "",
        comment: "",
        rating: 5
    });
    const [reviews, setReviews] = useState<Review[]>(
        () => JSON.parse(localStorage.getItem("reviews") || "[]")
    );
    const [lightboxState, setLightboxState] = useState({
        open: false,
        index: 0,
        images: [] as string[]
    });

    const countryOptions = countryList().getData();

    const openWhatsApp = () => {
        const phoneNumber = '+355692429567';
        const message = 'Hello, I have a question about Villa Safira';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    useEffect(() => {
        AOS.init({
            once: true,
            duration: 800,
            easing: 'ease-in-out',
            offset: 100,
            delay: 0,
        });

        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", onScroll);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await apiClient.get('/api/reviews');
                setReviews(response.data);
            } catch (err) {
                console.error('Error fetching reviews:', err);
                const localReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
                setReviews(localReviews);
            }
        };
        fetchReviews();
    }, []);

    const handleAddReview = async () => {
        if (newReview.name && newReview.country && newReview.comment && newReview.rating) {
            try {
                const response = await apiClient.post('/api/reviews', {
                    name: newReview.name,
                    country: newReview.country,
                    comment: newReview.comment,
                    rating: newReview.rating
                });

                setReviews(prev => [response.data, ...prev]);
                const updatedReviews = [response.data, ...reviews];
                localStorage.setItem("reviews", JSON.stringify(updatedReviews));
                setNewReview({name: "", country: "", comment: "", rating: 5});
            } catch (err) {
                console.error('Error saving to MongoDB, using localStorage instead:', err);
                const reviewToSave = {
                    ...newReview,
                    date: new Date().toLocaleDateString()
                };
                const updatedReviews = [reviewToSave, ...reviews];
                setReviews(updatedReviews);
                localStorage.setItem("reviews", JSON.stringify(updatedReviews));
                setNewReview({name: "", country: "", comment: "", rating: 5});
            }
        }
    };

    const galleryData: GalleryItem[] = [
        {
            id: "bedrooms",
            title: "Bedrooms",
            coverImage: "./dhome1.jpg",
            images: [
                "./dhome.jpg", "./dhome0.jpg", "./dhome1.jpg", "./dhome2.jpg", "./dhome3.jpg",
                "./dhome4.jpg", "./dhome5.jpg", "./dhome6.jpg", "./dhome7.jpg", "./dhome8.jpg",
                "./dhome9.jpg", "./dhome10.jpg", "./dhome11.jpg", "./dhome12.jpg", "./dhome13.jpg",
                "./dhome14.jpg", "./dhome15.jpg", "./dhome22.jpg", "./dhome70.jpg", "./dhome71.jpg"
            ]
        },
        {
            id: "bathrooms",
            title: "Bathrooms",
            coverImage: "./banjo1.jpg",
            images: ["./banjo1.jpg", "./banjo2.jpg", "./banjo4.jpg", "./banjo5.jpg", "./banjo6.jpg", "./banjo7.jpg", "./banjo8.jpg"]
        },
        {
            id: "kitchen",
            title: "Kitchen",
            coverImage: "./kuzhin.jpg",
            images: ["./kuzhin.jpg", "./kuzhin77.jpg", "./kuzhin78.jpg", "./kuzhin79.jpg", "./kuzhin2.jpg"]
        },
        {
            id: "outdoor",
            title: "Outdoor",
            coverImage: "./jasht1.jpg",
            images: ["./jasht1.jpg", "./jasht2.jpg", "./jasht3.jpg", "./jasht4.jpg", "./jasht5.jpg", "./jasht6.jpg", "./jasht7.jpg", "./jasht8.jpg"]
        }
    ];

    const handleBookNow = () => window.open("https://www.booking.com/hotel/al/villa-sol-durres.html", "_blank");

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({behavior: "smooth"});
            setIsMenuOpen(false);
        }
    };

    const renderStars = (rating: number) => (
        <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4, 5].map(i =>
                i <= rating ?
                    <Star key={i} className="text-amber-500 w-4 h-4 sm:w-5 sm:h-5"/> :
                    <StarOff key={i} className="text-amber-200 w-4 h-4 sm:w-5 sm:h-5"/>
            )}
        </div>
    );
    const [menuAnimation, setMenuAnimation] = useState<'opening' | 'open' | 'closing' | 'closed'>('closed');
    const toggleMenu = () => {
        if (!isMenuOpen) {
            setIsMenuOpen(true);
            setMenuAnimation('opening');
            setTimeout(() => setMenuAnimation('open'), 50); // Short delay to allow CSS transition
        } else {
            setMenuAnimation('closing');
            setTimeout(() => {
                setIsMenuOpen(false);
                setMenuAnimation('closed');
            }, 300); // Match this with your CSS transition duration
        }
    };

    return (
        <div className="font-poppins bg-amber-50 text-amber-900 min-h-screen">
            {/* Navbar */}
            <nav className="fixed w-full bg-amber-100/90 shadow-md backdrop-blur-sm z-50 border-b border-amber-200">
                <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3 sm:px-6 sm:py-4">
                    <div onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}
                         className="text-xl sm:text-2xl font-bold cursor-pointer text-amber-900">
                        Villa Safira
                    </div>

                    <button className="sm:hidden text-amber-900" onClick={toggleMenu}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"/>
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M4 6h16M4 12h16M4 18h16"/>
                            )}
                        </svg>
                    </button>

                    <ul className="hidden sm:flex space-x-4 sm:space-x-6 md:space-x-8 text-sm sm:text-base md:text-lg font-semibold text-amber-900">
                        {["about", "gallery", "facilities", "reviews"].map(sec => (
                            <li key={sec}
                                className="cursor-pointer hover:text-amber-700 transition"
                                onClick={() => scrollToSection(sec)}>
                                {sec.charAt(0).toUpperCase() + sec.slice(1)}
                            </li>
                        ))}
                        <li className="cursor-pointer hover:text-amber-700 transition"
                            onClick={() => {
                                const footer = document.querySelector('footer');
                                if (footer) footer.scrollIntoView({behavior: 'smooth'});
                            }}>
                            Contact
                        </li>
                    </ul>
                </div>

                {isMenuOpen && (
                    <div
                        className={`sm:hidden bg-amber-100 py-2 px-4 overflow-hidden transition-all duration-300 ease-in-out ${
                            menuAnimation === 'opening' ? 'max-h-0 opacity-0' :
                                menuAnimation === 'open' ? 'max-h-screen opacity-100' :
                                    menuAnimation === 'closing' ? 'max-h-0 opacity-0' :
                                        'max-h-0 opacity-0'
                        }`}>
                        {["about", "gallery", "facilities", "reviews", "contact"].map((sec) => (
                            <div
                                key={sec}
                                className={`py-3 border-b border-amber-200/50 transition-all duration-300 ${
                                    menuAnimation === 'opening' ? 'opacity-0 translate-y-2' :
                                        menuAnimation === 'open' ? 'opacity-100 translate-y-0' :
                                            menuAnimation === 'closing' ? 'opacity-0 -translate-y-2' :
                                                'opacity-0'
                                }`}
                                style={{transitionDelay: menuAnimation === 'opening' ? `${0.1 * ["about", "gallery", "facilities", "reviews", "contact"].indexOf(sec)}s` : '0s'}}
                            >
        <span
            className="cursor-pointer hover:text-amber-700 transition block"
            onClick={() => {
                scrollToSection(sec === "contact" ? "" : sec);
                toggleMenu();
            }}
        >
          {sec.charAt(0).toUpperCase() + sec.slice(1)}
        </span>
                            </div>
                        ))}
                    </div>
                )}

            </nav>

            {/* Hero Section */}
            <section id="hero"
                     className="relative h-screen flex justify-center items-center pt-16 sm:pt-20 overflow-hidden">
                {[0, 1].map(idx => (
                    <div key={idx}
                         className="absolute inset-0 bg-fixed bg-center transition-opacity duration-1000 ease-in-out"
                         style={{
                             backgroundImage: `url(${idx === 0
                                 ? (scrollY < window.innerHeight ? "./jasht3.jpg" : "./dhome7.jpg")
                                 : (scrollY >= window.innerHeight ? "./dhome7.jpg" : "./jasht3.jpg")
                             })`,
                             opacity: idx === 0
                                 ? (scrollY < window.innerHeight ? 1 : 0)
                                 : (scrollY >= window.innerHeight ? 1 : 0),
                             backgroundSize: "cover",
                             backgroundPosition: "center 30%"
                         }}/>
                ))}
                <div className="absolute inset-0 bg-amber-900/40"/>
                <div
                    className="relative z-10 text-center text-amber-50 px-4 sm:px-6 max-w-xs sm:max-w-md md:max-w-3xl">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-4 sm:mb-6 font-extrabold"
                        data-aos="fade-up"
                        data-aos-duration="1000">
                        Villa Safira
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 font-medium"
                       data-aos="fade-up"
                       data-aos-delay="800"
                       data-aos-duration="800">
                        Your cozy corner of the coast
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center"
                         data-aos="fade-up"
                         data-aos-delay="1200"
                         data-aos-duration="600">
                        <button
                            onClick={handleBookNow}
                            className=" bg-transparent border-2 border-amber-50 hover:bg-amber-50 hover:text-amber-900 text-amber-50 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full text-sm sm:text-base md:text-lg font-semibold transition-transform hover:scale-105"
                        >
                            <Calendar className="inline-block mr-2" size={isMobile ? 16 : 20}/>
                            Check Availability & Book
                        </button>
                        <button
                            className=" bg-transparent border-2 border-amber-50 hover:bg-amber-50 hover:text-amber-900 text-amber-50 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full text-sm sm:text-base md:text-lg font-semibold transition-transform hover:scale-105"
                            onClick={openWhatsApp}
                        >
                            Contact Now
                        </button>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about"
                     className="py-12 sm:py-16 md:py-20 bg-amber-50 max-w-6xl mx-auto px-4 sm:px-6 rounded-xl shadow-lg my-8 sm:my-12 border border-amber-100"
                     data-aos="fade-up">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 text-amber-900"
                    data-aos="fade-up">About Villa Safira</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-center">
                    <img src="./dhome7.jpg" alt="Villa Exterior"
                         className="rounded-xl sm:rounded-2xl shadow-lg w-full h-auto"
                         data-aos="fade-right"/>
                    <p className="text-sm sm:text-base md:text-lg leading-relaxed text-amber-900"
                       data-aos="fade-left">
                        Welcome to Villa Safira, a charming 4-floor B&B just a short walk from the sea in Durrës!
                        We offer 4 stylish rooms (3 with private balconies and garden view, 1 with garden view
                        only), each with cozy decor and all the comforts you need. Breakfast is included, and
                        guests can enjoy a shared kitchen if desired. Whether you're a couple, family, or business
                        traveler, Villa Safira is your peaceful retreat near the beach. Fast Wi-Fi, garden access,
                        and warm hospitality await!
                    </p>
                </div>
            </section>

            {/* Facilities Section */}
            <section id="facilities"
                     className="py-12 sm:py-16 md:py-20 max-w-6xl mx-auto px-4 sm:px-6 rounded-xl shadow-lg my-8 sm:my-12 bg-amber-50 border border-amber-100">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 md:mb-16 text-amber-900"
                    data-aos="fade-up">Facilities & Amenities</h2>
                <div
                    className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                    {[
                        {icon: Wifi, text: "Free Wi‑Fi"},
                        {icon: Coffee, text: "Breakfast Included"},
                        {icon: Utensils, text: "Shared Kitchen"},
                        {icon: TreePine, text: "Garden Access"},
                        {icon: Car, text: "Free Parking"},
                        {icon: Bath, text: "Private Bathrooms"},
                        {icon: Bed, text: "Comfortable Beds"},
                        {icon: Sun, text: "Balconies"},
                        {icon: MapPin, text: "Near Beach"},
                        {icon: Users, text: "Family Friendly"},
                        {icon: Shield, text: "Safe & Secure"},
                        {icon: Clock, text: "24/7 Support"}
                    ].map((f, i) => (
                        <div key={i}
                             className="flex flex-col items-center p-4 sm:p-6 md:p-8 bg-amber-100 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 cursor-pointer"
                             data-aos="fade-up"
                             data-aos-delay={i * 50}>
                            <f.icon
                                className="text-amber-700 mb-2 sm:mb-3 md:mb-4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"/>
                            <span
                                className="text-xs sm:text-sm md:text-base font-semibold text-center text-amber-900">{f.text}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery"
                     className="py-12 sm:py-16 md:py-20 max-w-6xl mx-auto px-4 sm:px-6 rounded-xl shadow-lg my-8 sm:my-12 bg-amber-50 border border-amber-100"
                     data-aos="fade-up">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 md:mb-16 text-amber-900">Explore
                    Our Spaces</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                    {galleryData.map((g, i) => (
                        <div
                            key={g.id}
                            className="relative group cursor-pointer rounded-lg sm:rounded-xl overflow-hidden shadow-md h-48 sm:h-64 md:h-80"
                            onClick={() => {
                                setLightboxState({
                                    open: true,
                                    index: 0,
                                    images: g.images
                                });
                            }}
                            data-aos="fade-up"
                            data-aos-delay={i * 100}
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{backgroundImage: `url(${g.coverImage})`}}
                            />
                            <div
                                className="absolute inset-0 bg-amber-900/40 group-hover:bg-amber-900/60 transition-opacity duration-300"/>
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-50 drop-shadow-lg">{g.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <Lightbox
                    open={lightboxState.open}
                    close={() => setLightboxState({...lightboxState, open: false})}
                    index={lightboxState.index}
                    slides={lightboxState.images.map(img => ({src: img}))}
                    controller={{
                        closeOnBackdropClick: true,
                        closeOnPullDown: true,
                    }}
                    render={{
                        iconPrev: () => <ChevronLeft size={isMobile ? 32 : 48} className="text-amber-700"/>,
                        iconNext: () => <ChevronRight size={isMobile ? 32 : 48} className="text-amber-700"/>,
                        iconClose: () => <X size={isMobile ? 24 : 32} className="text-amber-700"/>,
                    }}
                />
            </section>

            {/* Booking Section */}
            <section id="booking" className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-amber-900">
                    Book Your Stay
                </h2>

                <div className="bg-amber-100 rounded-xl p-6 sm:p-8 shadow-md" data-aos="fade-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-amber-900 mb-4">
                                Ready to experience Villa Safira?
                            </h3>
                            <p className="text-amber-900 mb-6">
                                Check availability for your preferred dates and book directly with us.
                                We offer secure payments through Paysera.
                            </p>
                            <ul className="space-y-3 text-amber-900">
                                <li className="flex items-start gap-2">
                                    <Check className="text-amber-700 mt-1 flex-shrink-0" size={18}/>
                                    <span>Best price guarantee</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="text-amber-700 mt-1 flex-shrink-0" size={18}/>
                                    <span>No booking fees</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="text-amber-700 mt-1 flex-shrink-0" size={18}/>
                                    <span>Secure payment processing</span>
                                </li>
                            </ul>
                        </div>

                        <div className="text-center" data-aos="fade-up">
                            <button
                                onClick={handleBookNow}
                                className="bg-amber-700 hover:bg-amber-800 text-amber-50 px-6 py-4 rounded-full text-lg font-semibold shadow-lg transition-transform hover:scale-105 w-full max-w-xs"
                            >
                                <Calendar className="inline-block mr-2" size={24}/>
                                Check Availability & Book
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Review Section */}
            <section id="reviews"
                     className="py-12 sm:py-16 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 rounded-xl shadow-lg my-8 sm:my-12 bg-amber-50 border border-amber-100"
                     data-aos="fade-up">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-amber-900">Guest
                    Reviews</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                    {reviews.length === 0 ? (
                        <div className="col-span-3 text-center text-amber-900 opacity-70">No reviews yet.</div>
                    ) : reviews.map((r, i) => (
                        <div key={i}
                             className="bg-amber-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
                             data-aos="fade-up"
                             data-aos-delay={i * 100}>
                            <p className="italic text-xs sm:text-sm text-amber-900 mb-2">"{r.comment}"</p>
                            <div className="text-sm sm:text-base font-semibold text-amber-900">
                                {r.name} <span className="opacity-80">({r.country})</span>
                            </div>
                            <div className="text-xs text-amber-900 opacity-70 mb-1">{r.date}</div>
                            {renderStars(r.rating)}
                        </div>
                    ))}
                </div>

                <div className="bg-amber-100 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-sm">
                    <input
                        type="text"
                        placeholder="Your name"
                        value={newReview.name}
                        onChange={e => setNewReview({...newReview, name: e.target.value})}
                        className="w-full mb-3 px-4 py-2 sm:px-5 sm:py-3 rounded-lg border border-amber-300 text-sm sm:text-base text-amber-900 placeholder-amber-500 focus:ring-amber-500 transition"
                    />

                    <Select
                        options={countryOptions}
                        className="mb-3 text-sm sm:text-base"
                        placeholder="Your country"
                        value={countryOptions.find(c => c.value === newReview.country)}
                        onChange={opt => setNewReview({...newReview, country: opt?.value})}
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                borderColor: "#92400e",
                                padding: '0.25rem',
                                fontSize: isMobile ? '0.875rem' : '1rem'
                            }),
                            option: (provided) => ({
                                ...provided,
                                fontSize: isMobile ? '0.875rem' : '1rem'
                            })
                        }}
                    />

                    <textarea
                        placeholder="Your review"
                        value={newReview.comment}
                        onChange={e => setNewReview({...newReview, comment: e.target.value})}
                        rows={4}
                        className="w-full mb-3 px-4 py-2 sm:px-5 sm:py-3 rounded-lg border border-amber-300 text-sm sm:text-base text-amber-900 placeholder-amber-500 focus:ring-amber-500 transition"
                    />

                    <label
                        className="text-sm sm:text-base font-semibold text-amber-900 mb-1 sm:mb-2 block">Rating:</label>
                    <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Star
                                key={i}
                                size={isMobile ? 24 : 30}
                                className={`cursor-pointer ${newReview.rating >= i ? "text-amber-500" : "text-amber-200"}`}
                                onClick={() => setNewReview({...newReview, rating: i})}
                            />
                        ))}
                    </div>

                    <button onClick={handleAddReview}
                            className="bg-amber-700 hover:bg-amber-800 text-amber-50 w-full py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition">
                        Submit Review
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-amber-900 text-amber-50 py-8 sm:py-12 backdrop-blur-sm border-t border-amber-200">
                <div
                    className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between gap-6 sm:gap-8 md:gap-0">
                    <div className="md:w-1/4 space-y-2 sm:space-y-4">
                        <h3 className="text-lg sm:text-xl font-bold">Stay at Villa Safira</h3>
                        <p className="text-sm sm:text-base max-w-xs">
                            Experience comfort, calm, and beauty just steps away from
                            the beach in Durrës.
                        </p>
                    </div>

                    <div className="md:w-1/3 md:text-center md:ml-8">
                        <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Quick Links</h4>
                        <ul className="space-y-1 sm:space-y-2">
                            {["about", "gallery", "facilities", "reviews"].map(sec => (
                                <li key={sec}
                                    className="underline hover:text-amber-700 mouse-pointer"
                                    aria-label="Contact Villa Safira via email"
                                    rel="noopener noreferrer"
                                    onClick={() => scrollToSection(sec)}>
                                    {sec.charAt(0).toUpperCase() + sec.slice(1)}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:w-5/12 space-y-1 sm:space-y-2">
                        <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Contact</h4>
                        <p className="text-sm sm:text-base"
                           aria-label="Contact Villa Safira via email">📍 <a
                            href="https://maps.app.goo.gl/hZa8t1TER1ymqn338"
                            target="_blank" rel="noopener noreferrer"
                            className="underline hover:text-amber-700">Durrës,
                            Albania</a></p>
                        <p className="text-sm sm:text-base">
                            📧{' '}
                            <a
                                href="mailto:villasafiradurres@gmail.com?subject=Inquiry%20about%20Villa%20Safira"
                                className="underline hover:text-amber-700 "
                            >
                                villasafiradurres@gmail.com
                            </a>
                        </p>
                        <p className="text-sm sm:text-base">
                            📞{' '}
                            {isMobile ? (
                                <a
                                    href={`https://wa.me/+355692429567`}
                                    className="underline hover:text-amber-700"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    +355692429567
                                </a>
                            ) : (
                                '+355692429567'
                            )}
                        </p>
                    </div>
                </div>
                <div
                    className="text-center py-3 text-amber-900 border-t border-amber-200 bg-amber-50/80 text-xs sm:text-sm mt-6 sm:mt-8">
                    © {new Date().getFullYear()} Villa Safira. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default App;
export {apiClient};