import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
// @ts-expect-error — no types for react-select-country-list
import countryList from 'react-select-country-list';
import { Star } from 'lucide-react';
import { FadeUp } from '../ui/FadeUp';
import { MaskReveal } from '../ui/MaskReveal';
import { apiClient } from '../../api';
import type { Review } from '../../types';

const COUNTRY_OPTIONS = countryList().getData() as { value: string; label: string }[];

interface StarRatingProps {
    rating: number;
    interactive?: boolean;
    onChange?: (r: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, interactive = false, onChange }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
            <button
                key={i}
                type="button"
                disabled={!interactive}
                aria-label={interactive ? `Rate ${i} stars` : undefined}
                onClick={() => onChange?.(i)}
                className={interactive ? 'cursor-pointer' : 'cursor-default pointer-events-none'}
            >
                <Star
                    className={`${interactive ? 'w-6 h-6' : 'w-4 h-4'} transition-colors duration-200 ${
                        i <= rating ? 'text-gold fill-gold' : 'text-sand'
                    }`}
                />
            </button>
        ))}
    </div>
);

const selectStyles = {
    control: (base: Record<string, unknown>) => ({
        ...base,
        borderRadius: '1rem',
        padding: '0.2rem 0.25rem',
        border: 'none',
        backgroundColor: '#F0E9DF',
        fontSize: '0.875rem',
        boxShadow: 'none',
        '&:hover': { border: 'none' },
    }),
    menu: (base: Record<string, unknown>) => ({ ...base, borderRadius: '1rem', overflow: 'hidden' }),
    option: (base: Record<string, unknown>, state: { isSelected: boolean; isFocused: boolean }) => ({
        ...base,
        backgroundColor: state.isSelected ? '#C9A052' : state.isFocused ? '#F0E9DF' : 'white',
        color: state.isSelected ? 'white' : '#1C1613',
        fontSize: '0.875rem',
    }),
};

export const ReviewsSection: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [form, setForm] = useState({ name: '', country: '', comment: '', rating: 5 });
    const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const fetchReviews = useCallback(async () => {
        try {
            const res = await apiClient.get('/api/reviews');
            const data = Array.isArray(res.data) ? res.data : [];
            setReviews(data);
            localStorage.setItem('reviews', JSON.stringify(data));
        } catch {
            const local = JSON.parse(localStorage.getItem('reviews') || '[]');
            setReviews(Array.isArray(local) ? local : []);
        }
    }, []);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const validate = () => {
        const e: typeof errors = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.country.trim()) e.country = 'Country is required';
        if (!form.comment.trim()) e.comment = 'Comment is required';
        return e;
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setErrors({});
        setSubmitting(true);
        try {
            await apiClient.post('/api/reviews', form);
            const fresh = await apiClient.get('/api/reviews');
            const freshData = Array.isArray(fresh.data) ? fresh.data : [];
            setReviews(freshData);
            localStorage.setItem('reviews', JSON.stringify(freshData));
        } catch {
            const reviewToSave: Review = { ...form, date: new Date().toLocaleDateString() };
            const currentReviews = Array.isArray(reviews) ? reviews : [];
            const updated = [reviewToSave, ...currentReviews];
            setReviews(updated);
            localStorage.setItem('reviews', JSON.stringify(updated));
        }
        setForm({ name: '', country: '', comment: '', rating: 5 });
        setSubmitting(false);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
    };

    const inputClass = (field: keyof typeof errors) =>
        `w-full px-5 py-3.5 rounded-2xl bg-cream border text-sm text-warmBlack placeholder-warmMuted/60 focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all duration-300 ${
            errors[field] ? 'border-red-300' : 'border-transparent'
        }`;

    const averageRating = reviews.length
        ? Math.round((reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0) / reviews.length) * 10) / 10
        : 0;

    return (
        <section id="reviews" className="relative pt-24 pb-6 bg-gradient-to-b from-cream via-ivory to-cream overflow-hidden h-screen snap-start flex flex-col justify-center">
            <div
                className="absolute inset-0 opacity-[0.035] pointer-events-none"
                style={{
                    backgroundImage:
                        'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
                    backgroundRepeat: 'repeat',
                }}
            />
            <div className="max-w-7xl mx-auto px-6 sm:px-12">
                <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                    {/* Left — sticky column */}
                    <div className="lg:col-span-4 space-y-4">
                        <div>
                            <FadeUp>
                                <div className="w-fit mb-3">
                                    <div className="inline-flex items-center bg-white/60 backdrop-blur-xl border border-sand rounded-full px-4 py-2 shadow-sm shadow-warmBlack/5">
                                        <p className="section-label text-gold tracking-[0.4em]">Chapter VI — The Voice</p>
                                    </div>
                                </div>
                            </FadeUp>
                            <MaskReveal>
                                <h2 className="font-serif text-3xl sm:text-4xl font-light text-warmBlack leading-tight mb-3">
                                    Notes from
                                    <br />
                                    <em className="italic text-gold">our guests.</em>
                                </h2>
                            </MaskReveal>
                            <FadeUp delay={0.2}>
                                <p className="text-warmMuted text-base font-light leading-relaxed">Quiet words, honest impressions.</p>
                            </FadeUp>
                        </div>

                        <FadeUp delay={0.18}>
                            <div className="rounded-[2rem] bg-white/70 backdrop-blur-xl border border-sand shadow-2xl shadow-warmBlack/10 p-4">
                                <p className="text-[10px] tracking-[0.45em] uppercase text-warmMuted/70">Overall</p>
                                <div className="mt-4 flex items-end justify-between gap-6">
                                    <div>
                                        <div className="font-serif text-4xl text-warmBlack leading-none">
                                            {reviews.length ? averageRating : '—'}
                                        </div>
                                        <div className="mt-3">
                                            <StarRating rating={Math.round(averageRating) || 5} />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] tracking-[0.35em] uppercase text-warmMuted/70">Reviews</p>
                                        <p className="mt-2 font-serif text-2xl text-gold">{reviews.length}</p>
                                    </div>
                                </div>
                            </div>
                        </FadeUp>

                        {/* Review form */}
                        <FadeUp delay={0.25}>
                            <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[2rem] border border-sand/80 shadow-2xl shadow-warmBlack/10">
                                <h4 className="font-serif text-lg text-warmBlack mb-4">Leave a note</h4>
                                {submitted ? (
                                    <div className="py-8 text-center">
                                        <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                                            <Star className="w-5 h-5 text-gold fill-gold" />
                                        </div>
                                        <p className="text-warmBlack font-medium text-sm">Thank you!</p>
                                        <p className="text-warmMuted text-xs mt-1">Your review has been published.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Your Name"
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                className={inputClass('name')}
                                                aria-label="Your name"
                                            />
                                            {errors.name && <p className="text-red-400 text-xs mt-1 ml-2">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <Select
                                                options={COUNTRY_OPTIONS}
                                                placeholder="Your Country"
                                                value={COUNTRY_OPTIONS.find((c) => c.label === form.country) || null}
                                                onChange={(opt) => {
                                                    if (opt) setForm({ ...form, country: opt.label });
                                                }}
                                                styles={selectStyles}
                                                aria-label="Your country"
                                            />
                                            {errors.country && <p className="text-red-400 text-xs mt-1 ml-2">{errors.country}</p>}
                                        </div>
                                        <div className="flex gap-1.5 py-2 px-1">
                                            <StarRating
                                                rating={form.rating}
                                                interactive
                                                onChange={(r) => setForm({ ...form, rating: r })}
                                            />
                                        </div>
                                        <div>
                                            <textarea
                                                placeholder="Share your experience..."
                                                value={form.comment}
                                                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                                                rows={2}
                                                className={inputClass('comment')}
                                                aria-label="Your experience"
                                            />
                                            {errors.comment && <p className="text-red-400 text-xs mt-1 ml-2">{errors.comment}</p>}
                                        </div>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={submitting}
                                            className="w-full py-4 bg-navy text-white rounded-2xl text-xs font-bold tracking-[0.2em] uppercase hover:bg-navyMid disabled:opacity-60 transition-all duration-300"
                                        >
                                            {submitting ? 'Publishing...' : 'Publish'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </FadeUp>
                    </div>

                    {/* Right — review cards */}
                    <div className="lg:col-span-8">
                        {reviews.length === 0 ? (
                            <FadeUp>
                                <div className="h-72 flex flex-col items-center justify-center border-2 border-dashed border-sand rounded-[2rem] text-warmMuted/50 gap-4">
                                    <Star className="w-8 h-8 text-sand" />
                                    <p className="text-xs uppercase tracking-widest">Waiting for the first story…</p>
                                </div>
                            </FadeUp>
                        ) : (
                            <div className="columns-1 sm:columns-2 gap-6 space-y-6">
                                {reviews.map((rev, i) => (
                                    <FadeUp key={i} delay={i * 0.07}>
                                        <div className="break-inside-avoid bg-white/85 backdrop-blur-xl p-7 rounded-[2rem] border border-sand/80 shadow-2xl shadow-warmBlack/10 hover:shadow-2xl hover:border-gold/25 transition-all duration-300 mb-6">
                                            <div className="flex justify-between items-start mb-5">
                                                <div>
                                                    <h5 className="font-serif text-lg text-warmBlack">{rev.name}</h5>
                                                    <p className="text-warmMuted/60 text-[10px] uppercase tracking-widest mt-0.5">
                                                        {rev.country ?? rev.coountry}
                                                    </p>
                                                </div>
                                                <StarRating rating={rev.rating} />
                                            </div>
                                            <p className="text-warmMuted font-light leading-relaxed italic text-sm">
                                                "{rev.comment}"
                                            </p>
                                            {rev.date && (
                                                <div className="mt-5 pt-5 border-t border-sand/50">
                                                    <p className="text-warmMuted/40 text-[10px] uppercase tracking-widest">
                                                        {rev.date}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </FadeUp>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
