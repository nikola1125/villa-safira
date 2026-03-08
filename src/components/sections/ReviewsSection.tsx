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
            setReviews(res.data);
            localStorage.setItem('reviews', JSON.stringify(res.data));
        } catch {
            const local = JSON.parse(localStorage.getItem('reviews') || '[]');
            setReviews(local);
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
            setReviews(fresh.data);
            localStorage.setItem('reviews', JSON.stringify(fresh.data));
        } catch {
            const reviewToSave: Review = { ...form, date: new Date().toLocaleDateString() };
            const updated = [reviewToSave, ...reviews];
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

    return (
        <section id="reviews" className="py-32 sm:py-48 bg-cream overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 sm:px-12">
                <div className="grid lg:grid-cols-3 gap-16 lg:gap-24 items-start">

                    {/* Left — sticky column */}
                    <div className="lg:sticky lg:top-28 space-y-10">
                        <div>
                            <FadeUp>
                                <p className="section-label text-gold mb-8 tracking-[0.4em]">Chapter VI — The Voice</p>
                            </FadeUp>
                            <MaskReveal>
                                <h2 className="font-serif text-4xl sm:text-5xl font-light text-warmBlack leading-tight mb-6">
                                    Stories from<br />
                                    <em className="italic text-gold">our Guests.</em>
                                </h2>
                            </MaskReveal>
                            <FadeUp delay={0.2}>
                                <p className="text-warmMuted text-base font-light leading-relaxed">
                                    The best tellers of our story are those who have lived it.
                                </p>
                            </FadeUp>
                        </div>

                        {/* Review form */}
                        <FadeUp delay={0.25}>
                            <div className="bg-white p-7 rounded-3xl border border-sand shadow-sm">
                                <h4 className="font-serif text-xl text-warmBlack mb-6">Leave your mark</h4>
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
                                                rows={4}
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
                                            {submitting ? 'Publishing...' : 'Publish Note'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </FadeUp>
                    </div>

                    {/* Right — review cards */}
                    <div className="lg:col-span-2">
                        {reviews.length === 0 ? (
                            <FadeUp>
                                <div className="h-72 flex flex-col items-center justify-center border-2 border-dashed border-sand rounded-3xl text-warmMuted/50 gap-4">
                                    <Star className="w-8 h-8 text-sand" />
                                    <p className="text-xs uppercase tracking-widest">Waiting for the first story…</p>
                                </div>
                            </FadeUp>
                        ) : (
                            <div className="columns-1 sm:columns-2 gap-6 space-y-6">
                                {reviews.map((rev, i) => (
                                    <FadeUp key={i} delay={i * 0.07}>
                                        <div className="break-inside-avoid bg-white p-7 rounded-3xl border border-sand shadow-sm hover:shadow-md hover:border-gold/20 transition-all duration-300 mb-6">
                                            <div className="flex justify-between items-start mb-5">
                                                <div>
                                                    <h5 className="font-serif text-lg text-warmBlack">{rev.name}</h5>
                                                    <p className="text-warmMuted/60 text-[10px] uppercase tracking-widest mt-0.5">
                                                        {rev.country}
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
