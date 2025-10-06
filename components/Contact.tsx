import React, { useState } from 'react';
import UserIcon from './icons/UserIcon';
import MailIcon from './icons/MailIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import AlertTriangleIcon from './icons/AlertTriangleIcon';

const WEBHOOK_URL = "https://hook.us1.make.com/4l8lzx2hcxhby7v1qlh1grhna8oymlnd";

type FormState = 'idle' | 'loading' | 'success' | 'error';
interface FormData {
    name: string;
    email: string;
    message: string;
}
interface FormErrors {
    name?: string;
    email?: string;
    message?: string;
}

const AnimatedSuccessIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path className="checkmark__circle" d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline className="checkmark__check" points="22 4 12 14.01 9 11.01" />
    </svg>
);


const Contact: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState<FormErrors>({});
    const [formState, setFormState] = useState<FormState>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required.';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid.';
        }
        if (!formData.message.trim()) newErrors.message = 'Message is required.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setFormState('loading');
        setErrorMessage('');

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            
            setFormState('success');
            setFormData({ name: '', email: '', message: '' });

        } catch (error) {
            setFormState('error');
            setErrorMessage('Something went wrong. Please try again later.');
            console.error('Failed to send message:', error);
        }
    };

    return (
        <section id="contact" className="bg-slate-950 py-20 md:py-32">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in-up">
                    Get In <span className="text-amber-400">Touch</span>
                </h2>
                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 animate-fade-in-up delay-100">
                    Have a question or feedback? We'd love to hear from you.
                </p>

                <div className="max-w-xl mx-auto animate-fade-in-up delay-200">
                    {formState === 'success' ? (
                        <div role="status" className="bg-green-500/10 border border-green-500/30 text-green-300 text-center rounded-lg p-8 animate-scale-in">
                           <AnimatedSuccessIcon className="text-green-400 mx-auto animate-success-icon" />
                            <h3 className="text-2xl font-bold mt-4">Message Sent!</h3>
                            <p className="mt-2">Thank you for reaching out. We'll get back to you if a response is needed.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate className="space-y-6 text-left" aria-live="polite">
                            <div>
                                <label htmlFor="name" className="sr-only">Your Name</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <UserIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your Name"
                                        required
                                        className={`w-full bg-slate-800 border ${errors.name ? 'border-red-500 text-red-400' : 'border-slate-700'} rounded-lg py-3 pl-10 pr-10 focus:outline-none focus:ring-2 ${errors.name ? 'focus:ring-red-500' : 'focus:ring-amber-400'}`}
                                        aria-invalid={!!errors.name}
                                        aria-describedby={errors.name ? "name-error" : undefined}
                                    />
                                    {errors.name && (
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                            <AlertTriangleIcon className="h-5 w-5 text-red-500" />
                                        </div>
                                    )}
                                </div>
                                {errors.name && <p id="name-error" className="text-red-400 text-sm mt-1" role="alert">{errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="email" className="sr-only">Your Email</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <MailIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Your Email"
                                        required
                                        className={`w-full bg-slate-800 border ${errors.email ? 'border-red-500 text-red-400' : 'border-slate-700'} rounded-lg py-3 pl-10 pr-10 focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-red-500' : 'focus:ring-amber-400'}`}
                                        aria-invalid={!!errors.email}
                                        aria-describedby={errors.email ? "email-error" : undefined}
                                    />
                                     {errors.email && (
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                            <AlertTriangleIcon className="h-5 w-5 text-red-500" />
                                        </div>
                                    )}
                                </div>
                                {errors.email && <p id="email-error" className="text-red-400 text-sm mt-1" role="alert">{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="message" className="sr-only">Your Message</label>
                                <div className="relative">
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Your Message"
                                        required
                                        className={`w-full bg-slate-800 border ${errors.message ? 'border-red-500 text-red-400' : 'border-slate-700'} rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 ${errors.message ? 'focus:ring-red-500' : 'focus:ring-amber-400'}`}
                                        aria-invalid={!!errors.message}
                                        aria-describedby={errors.message ? "message-error" : undefined}
                                    ></textarea>
                                    {errors.message && (
                                        <div className="pointer-events-none absolute top-3 right-0 flex items-center pr-3">
                                            <AlertTriangleIcon className="h-5 w-5 text-red-500" />
                                        </div>
                                    )}
                                </div>
                                {errors.message && <p id="message-error" className="text-red-400 text-sm mt-1" role="alert">{errors.message}</p>}
                            </div>
                            
                            {formState === 'error' && (
                                <div className="bg-red-900/20 border border-red-500/50 text-red-400 text-sm rounded-lg p-3 flex items-center gap-3" role="alert">
                                    <AlertTriangleIcon className="w-5 h-5 flex-shrink-0" />
                                    <p>{errorMessage}</p>
                                </div>
                            )}

                            <div className="text-center">
                                <button
                                    type="submit"
                                    disabled={formState === 'loading'}
                                    className="inline-flex items-center justify-center bg-amber-400 text-black font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-200 ease-out motion-safe:hover:scale-105 motion-safe:active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {formState === 'loading' ? (
                                        <>
                                            <SpinnerIcon className="w-5 h-5 mr-2" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Message'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Contact;