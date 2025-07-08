import React, {useState, useEffect} from 'react';
import {Calendar as CalendarIcon, X, Check, Clock, CreditCard, Euro, User, Phone, Mail, Loader2} from 'lucide-react';
import axios from 'axios';
import {apiClient} from '../App.tsx';
import {format, isBefore, isAfter, isSameDay, differenceInDays, isValid, addDays} from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    state = {hasError: false};

    static getDerivedStateFromError() {
        return {hasError: true};
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('BookingCalendar Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-100 text-red-800 rounded-lg">
                    <h3>Something went wrong</h3>
                    <p>Please refresh the page and try again.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

interface BookingCalendarProps {
    onClose: () => void;
}

interface RoomType {
    id: string;
    name: string;
    capacities: number[];
    rates: {
        [key: number]: {
            withoutBreakfast: number;
            withBreakfast: number;
        };
    };
}

interface AvailabilityResponse {
    available: boolean;
    nights?: number;
    total?: number;
    roomName?: string;
}

interface BookedDate {
    start: Date;
    end: Date;
}

interface BookingData {
    _id: string;
    checkIn: Date;
    checkOut: Date;
    roomType: string;
    guests: number;
    breakfast: boolean;
    totalPrice: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    paymentStatus: 'pending' | 'paid';
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({onClose}) => {
    const [step, setStep] = useState<'calendar' | 'selection' | 'details' | 'payment' | 'confirmation'>('calendar');
    const [roomTypes] = useState<RoomType[]>([
        {
            id: 'deluxe-double',
            name: 'Deluxe Double Room',
            capacities: [2],
            rates: {
                2: {withoutBreakfast: 50, withBreakfast: 55}
            }
        },
        {
            id: 'deluxe-double-balcony',
            name: 'Deluxe Double Room With Balcony',
            capacities: [2, 3],
            rates: {
                2: {withoutBreakfast: 60, withBreakfast: 65},
                3: {withoutBreakfast: 75, withBreakfast: 80}
            }
        },
        {
            id: 'triple-garden',
            name: 'Triple Room with garden view',
            capacities: [2, 3],
            rates: {
                2: {withoutBreakfast: 60, withBreakfast: 65},
                3: {withoutBreakfast: 75, withBreakfast: 80}
            }
        },
        {
            id: 'deluxe-family',
            name: 'Deluxe Family Suite',
            capacities: [3, 4],
            rates: {
                3: {withoutBreakfast: 80, withBreakfast: 85},
                4: {withoutBreakfast: 95, withBreakfast: 100}
            }
        }
    ]);

    const [selectedRoom, setSelectedRoom] = useState<string>('');
    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);
    const [guests, setGuests] = useState<number>(2);
    const [breakfast, setBreakfast] = useState<boolean>(true);
    const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [paymentUrl, setPaymentUrl] = useState<string>('');
    const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);
    const [availableRooms, setAvailableRooms] = useState<RoomType[]>([]);
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
    const [bookingData, setBookingData] = useState<BookingData | null>(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const isValidDate = (date: Date | null): date is Date => {
        return date instanceof Date && isValid(date);
    };

    useEffect(() => {
        const fetchBookedDates = async () => {
            try {
                const response = await apiClient.get('/api/booked-dates');
                const dates = response.data
                    .filter((booking: any) => booking.start && booking.end)
                    .map((booking: any) => ({
                        start: new Date(booking.start),
                        end: new Date(booking.end),
                    }))
                    .filter((d: any) => isValidDate(d.start) && isValidDate(d.end));
                setBookedDates(dates);
            } catch (err) {
                console.error('Error fetching booked dates:', err);
                setError('Failed to load booking calendar. Please refresh the page.');
            }
        };

        fetchBookedDates();
    }, []);

    const isDateBooked = (date: Date) => {
        if (!isValidDate(date)) return false;
        return bookedDates.some(booking =>
            (isAfter(date, booking.start) || isSameDay(date, booking.start)) &&
            (isBefore(date, booking.end) || isSameDay(date, booking.end))
        );
    };

    const isDateDisabled = (date: Date) => {
        if (!isValidDate(date)) return true;
        return isDateBooked(date) || isBefore(date, new Date());
    };

    const isRangeValid = (start: Date | null, end: Date | null) => {
        if (!start || !end) return false;

        // Check if any date in the range is booked
        let current = new Date(start);
        while (current <= end) {
            if (isDateBooked(current)) return false;
            current = addDays(current, 1);
        }
        return true;
    };

    const tileContent = ({date, view}: { date: Date; view: string }) => {
        if (view === 'month') {
            if (isDateBooked(date)) {
                return (
                    <div className="absolute inset-0 bg-red-100/50 flex items-center justify-center">
                        <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    </div>
                );
            }
        }
        return null;
    };

    const tileClassName = ({date, view}: { date: Date; view: string }) => {
        const classes = ['relative']

        if (view === 'month') {
            if (isDateDisabled(date)) {
                classes.push('disabled-date');
            }
            if (isDateBooked(date)) {
                classes.push('booked-date');
            }
            if (checkIn && isSameDay(date, checkIn)) {
                classes.push('selected-start-date');
            }
            if (checkOut && isSameDay(date, checkOut)) {
                classes.push('selected-end-date');
            }
            if (checkIn && checkOut && date >= checkIn && date <= checkOut) {
                classes.push('selected-range');
            }
            if (hoveredDate && checkIn && !checkOut &&
                date > checkIn && date <= hoveredDate) {
                classes.push('hovered-range');
            }
        }
        return classes.join(' ');
    };

    const handleDateClick = (date: Date) => {
        try {
            if (!isValidDate(date)) {
                throw new Error('Invalid date selected');
            }

            if (isDateDisabled(date)) return;

            if (!checkIn) {
                setCheckIn(date);
            } else if (!checkOut && isAfter(date, checkIn)) {
                // Check if the selected range is valid
                if (isRangeValid(checkIn, date)) {
                    setCheckOut(date);
                    checkAllAvailability(date).catch(console.error);
                } else {
                    setError('Selected dates include booked periods. Please choose different dates.');
                    setCheckIn(date);
                    setCheckOut(null);
                }
            } else {
                setCheckIn(date);
                setCheckOut(null);
            }
        } catch (error) {
            console.error('Date selection error:', error);
            setError(error instanceof Error ? error.message : 'Invalid date selection');
        }
    };

    const handleDateHover = (date: Date) => {
        if (checkIn && !checkOut) {
            setHoveredDate(isAfter(date, checkIn) ? date : null);
        }
    };

    const checkAllAvailability = async (endDate: Date) => {
        if (!isValidDate(checkIn) || !isValidDate(endDate)) {
            setError('Invalid dates selected');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await apiClient.post('/api/check-availability', {
                checkIn: checkIn.toISOString(),
                checkOut: endDate.toISOString(),
                guests,
                breakfast
            });

            if (response.data?.available) {
                // Map the response to our room types structure
                const availableRooms = roomTypes.filter(room =>
                    response.data.rooms.some((r: any) => r.id === room.id)
                );

                setAvailableRooms(availableRooms);
                setStep(availableRooms.length > 0 ? 'selection' : 'calendar');
            } else {
                setError('No rooms available for selected dates');
            }
        } catch (error) {
            console.error('Availability check failed:', error);
            setError('Failed to check availability. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const checkAvailability = async () => {
        if (!selectedRoom || !isValidDate(checkIn) || !isValidDate(checkOut)) {
            setError('Please select valid room type and dates');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await apiClient.post('/api/check-availability', {
                roomType: selectedRoom,
                checkIn: checkIn.toISOString(),
                checkOut: checkOut.toISOString(),
                guests,
                breakfast
            });

            setAvailability(response.data);
            if (response.data?.available) {
                setStep('details');
            }
        } catch (err) {
            setError('Error checking availability. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
            setError('Please fill in all customer details');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await apiClient.post('/api/create-payment', {
                roomType: selectedRoom,
                checkIn: checkIn?.toISOString(),
                checkOut: checkOut?.toISOString(),
                guests,
                breakfast,
                customerInfo
            });

            setBookingData(response.data.booking);
            setPaymentUrl(response.data.paymentUrl);
            setStep('payment');

            // Open payment in new tab
            window.open(response.data.paymentUrl, '_blank');

            // Start polling for payment status
            pollPaymentStatus(response.data.booking._id);
        } catch (err) {
            setError('Error creating payment. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const pollPaymentStatus = async (bookingId: string) => {
        setIsProcessingPayment(true);
        let attempts = 0;
        const maxAttempts = 30; // 5 minutes (10s * 30)

        const checkStatus = async () => {
            try {
                const response = await apiClient.get(`/api/booking-status/${bookingId}`);
                if (response.data.paymentStatus === 'paid') {
                    setIsProcessingPayment(false);
                    setStep('confirmation');
                    // Send confirmation email
                    await apiClient.post('/api/send-confirmation', { bookingId });
                    return;
                }

                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(checkStatus, 10000); // Check every 10 seconds
                } else {
                    setIsProcessingPayment(false);
                    setError('Payment processing timed out. Please contact support.');
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(checkStatus, 10000);
                } else {
                    setIsProcessingPayment(false);
                    setError('Error verifying payment. Please contact support.');
                }
            }
        };

        checkStatus();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setCustomerInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const selectedRoomDetails = roomTypes.find(room => room.id === selectedRoom);
    const nights = isValidDate(checkIn) && isValidDate(checkOut)
        ? differenceInDays(checkOut, checkIn)
        : 0;

    const calculateRoomPrice = (room: RoomType) => {
        const capacity = room.capacities.includes(guests) ? guests : Math.max(...room.capacities.filter(c => c <= guests));
        const rate = breakfast ? room.rates[capacity].withBreakfast : room.rates[capacity].withoutBreakfast;
        return rate * nights;
    };

    return (
        <ErrorBoundary>
            <div className="fixed inset-0 bg-amber-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div
                    className="bg-amber-50 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-amber-900 hover:text-amber-700 transition-colors"
                    >
                        <X size={24}/>
                    </button>

                    <div className="p-6 sm:p-8 md:p-10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                            <CalendarIcon className="text-amber-700" size={28}/>
                            Book Your Stay
                        </h2>

                        {step === 'calendar' && (
                            <div className="space-y-6">
                                {error && (
                                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p>{error}</p>
                                    </div>
                                )}

                                <h3 className="text-xl font-semibold text-amber-900">
                                    Select your dates
                                </h3>
                                <p className="text-amber-700">
                                    {checkIn
                                        ? checkOut
                                            ? `Selected: ${format(checkIn, 'MMM d')} - ${format(checkOut, 'MMM d')}`
                                            : `Select check-out date (after ${format(checkIn, 'MMM d')})`
                                        : 'First select your check-in date'}
                                </p>

                                <div className="flex justify-center">
                                    <Calendar
                                        onChange={handleDateClick}
                                        value={checkIn}
                                        selectRange={true}
                                        minDate={new Date()}
                                        tileContent={tileContent}
                                        tileClassName={tileClassName}
                                        className="border-0 rounded-lg w-full"
                                        tileDisabled={({date}) => isDateDisabled(date)}
                                        onMouseOut={() => setHoveredDate(null)}
                                        onClickDay={handleDateClick}
                                        onMouseOver={({activeStartDate}) => {
                                            if (activeStartDate instanceof Date) {
                                                setHoveredDate(activeStartDate);
                                            }
                                        }}
                                        onMouseLeave={() => setHoveredDate(null)}
                                    />
                                </div>

                                <div className="mt-4 flex flex-wrap gap-4">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-red-100 rounded-full mr-2"></div>
                                        <span className="text-sm text-amber-900">Booked dates</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-amber-100 rounded-full mr-2"></div>
                                        <span className="text-sm text-amber-900">Selected dates</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-amber-200 rounded-full mr-2"></div>
                                        <span className="text-sm text-amber-900">Hovered dates</span>
                                    </div>
                                </div>

                                {checkIn && checkOut && (
                                    <button
                                        onClick={() => setStep('selection')}
                                        className="w-full bg-amber-700 hover:bg-amber-800 text-amber-50 py-3 px-6 rounded-lg font-semibold transition-colors"
                                    >
                                        View Available Rooms
                                    </button>
                                )}
                            </div>
                        )}

                        {step === 'selection' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-semibold text-amber-900">
                                        Available Rooms
                                    </h3>
                                    <button
                                        onClick={() => setStep('calendar')}
                                        className="text-amber-700 hover:text-amber-900 text-sm"
                                    >
                                        Change dates
                                    </button>
                                </div>

                                <div className="bg-amber-100 p-4 rounded-lg mb-4">
                                    <div className="flex justify-between items-center">
                                        <p className="font-medium text-amber-900">
                                            {format(checkIn!, 'MMM d')} - {format(checkOut!, 'MMM d')} ({nights} nights)
                                        </p>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center">
                                                <label className="mr-2 text-amber-900">Guests:</label>
                                                <select
                                                    value={guests}
                                                    onChange={(e) => setGuests(Number(e.target.value))}
                                                    className="bg-amber-50 border border-amber-300 rounded px-2 py-1"
                                                >
                                                    {[1, 2, 3, 4].map(num => (
                                                        <option key={num} value={num}>{num}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex items-center">
                                                <label className="mr-2 text-amber-900">Breakfast:</label>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={breakfast}
                                                        onChange={() => setBreakfast(!breakfast)}
                                                        className="sr-only peer"
                                                    />
                                                    <div
                                                        className="w-11 h-6 bg-amber-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-amber-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {availableRooms.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-amber-900">No rooms available for selected dates</p>
                                        <button
                                            onClick={() => setStep('calendar')}
                                            className="mt-4 text-amber-700 hover:text-amber-900 underline"
                                        >
                                            Try different dates
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {availableRooms.map(room => (
                                            <div
                                                key={room.id}
                                                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                                    selectedRoom === room.id
                                                        ? 'border-amber-700 bg-amber-100/50'
                                                        : 'border-amber-200 hover:border-amber-400'
                                                }`}
                                                onClick={() => setSelectedRoom(room.id)}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-semibold text-amber-900">{room.name}</h4>
                                                        <p className="text-sm text-amber-700">
                                                            Capacity: {room.capacities.join(', ')} guests
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-amber-900">
                                                            {calculateRoomPrice(room)} €
                                                        </p>
                                                        <p className="text-xs text-amber-700">
                                                            {nights} nights, {breakfast ? 'with breakfast' : 'no breakfast'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            onClick={checkAvailability}
                                            disabled={!selectedRoom || loading}
                                            className="w-full bg-amber-700 hover:bg-amber-800 text-amber-50 py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {loading ? (
                                                <Clock className="animate-spin" size={20}/>
                                            ) : (
                                                <Check size={20}/>
                                            )}
                                            Continue with Selected Room
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 'details' && availability?.available && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-lg shadow-md p-4 border border-amber-200">
                                    <h3 className="text-xl font-semibold text-amber-900 mb-3">Booking Summary</h3>
                                    <div className="space-y-2 text-amber-900">
                                        <p><strong>Room:</strong> {availability.roomName}</p>
                                        <p><strong>Check-in:</strong> {format(checkIn!, 'PPP')}</p>
                                        <p><strong>Check-out:</strong> {format(checkOut!, 'PPP')}</p>
                                        <p><strong>Nights:</strong> {availability.nights}</p>
                                        <p><strong>Guests:</strong> {guests}</p>
                                        <p><strong>Breakfast:</strong> {breakfast ? 'Included' : 'Not included'}</p>
                                        <p className="text-lg font-bold mt-2">
                                            <strong>Total:</strong> {availability.total} €
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-4 border border-amber-200">
                                    <h3 className="text-xl font-semibold text-amber-900 mb-3">Your Details</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-amber-900 font-medium mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={customerInfo.name}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-amber-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-amber-900 font-medium mb-1">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={customerInfo.email}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-amber-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-amber-900 font-medium mb-1">Phone
                                                Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={customerInfo.phone}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-amber-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p>{error}</p>
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setStep('selection')}
                                        className="flex-1 bg-amber-200 hover:bg-amber-300 text-amber-900 py-3 px-6 rounded-lg font-semibold transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handlePayment}
                                        disabled={loading}
                                        className="flex-1 bg-amber-700 hover:bg-amber-800 text-amber-50 py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin" size={20}/>
                                        ) : (
                                            <CreditCard size={20}/>
                                        )}
                                        Proceed to Payment
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 'payment' && paymentUrl && (
                            <div className="space-y-6 text-center">
                                <div className="bg-white rounded-lg shadow-md p-6 border border-amber-200">
                                    <div className="bg-blue-100 text-blue-700 p-4 rounded-lg mb-4">
                                        <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                                            <Clock size={24} className="text-blue-600"/>
                                            Payment Processing
                                        </h3>
                                        <p>Please complete your payment in the new tab that opened.</p>
                                    </div>

                                    <p className="text-amber-900 mb-6">
                                        If the payment window didn't open automatically, please click the button below.
                                    </p>

                                    <a
                                        href={paymentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 mx-auto"
                                    >
                                        <CreditCard size={20}/>
                                        Open Payment Page
                                    </a>

                                    {isProcessingPayment && (
                                        <div className="mt-6 flex items-center justify-center gap-2 text-amber-700">
                                            <Loader2 className="animate-spin" size={20}/>
                                            <span>Waiting for payment confirmation...</span>
                                        </div>
                                    )}

                                    <p className="text-sm text-amber-600 mt-4">
                                        You can safely close this window - we'll send a confirmation to your email.
                                    </p>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="bg-amber-200 hover:bg-amber-300 text-amber-900 py-2 px-4 rounded-lg font-medium transition-colors"
                                >
                                    Close This Window
                                </button>
                            </div>
                        )}

                        {step === 'confirmation' && bookingData && (
                            <div className="space-y-6 text-center">
                                <div className="bg-white rounded-lg shadow-md p-6 border border-amber-200">
                                    <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
                                        <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                                            <Check size={24} className="text-green-600"/>
                                            Booking Confirmed!
                                        </h3>
                                        <p>Your payment was successful and your booking is confirmed.</p>
                                    </div>

                                    <div className="text-left space-y-2 text-amber-900 mb-6">
                                        <p><strong>Booking Reference:</strong> {bookingData._id}</p>
                                        <p><strong>Room:</strong> {roomTypes.find(r => r.id === bookingData.roomType)?.name}</p>
                                        <p><strong>Check-in:</strong> {format(new Date(bookingData.checkIn), 'PPP')}</p>
                                        <p><strong>Check-out:</strong> {format(new Date(bookingData.checkOut), 'PPP')}</p>
                                        <p><strong>Guests:</strong> {bookingData.guests}</p>
                                        <p><strong>Breakfast:</strong> {bookingData.breakfast ? 'Included' : 'Not included'}</p>
                                        <p className="text-lg font-bold mt-2">
                                            <strong>Total Paid:</strong> {bookingData.totalPrice} €
                                        </p>
                                    </div>

                                    <p className="text-amber-900 mb-6">
                                        A confirmation has been sent to <strong>{bookingData.customerEmail}</strong> with all the details.
                                    </p>

                                    <button
                                        onClick={onClose}
                                        className="bg-amber-700 hover:bg-amber-800 text-amber-50 py-3 px-8 rounded-lg font-semibold transition-colors"
                                    >
                                        Finish
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default BookingCalendar;