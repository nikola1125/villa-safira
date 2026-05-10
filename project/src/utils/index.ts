export const handleBookNow = (): void => {
    window.open('https://www.booking.com/hotel/al/villa-sol-durres.html', '_blank');
};

export const openWhatsApp = (): void => {
    const phone = '+355692429567';
    const message = 'Hello, I have a question about Villa Safira.';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
};

export const scrollToSection = (id: string): void => {
    setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
};
