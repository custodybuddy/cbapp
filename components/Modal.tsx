import React, { useState, useEffect, useRef } from 'react';
import XIcon from './icons/XIcon';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    const [isRendered, setIsRendered] = useState(isOpen);
    const modalRef = useRef<HTMLDivElement>(null);

    // Accessibility: Trap focus within the modal when open
    useFocusTrap(modalRef, isOpen, onClose);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
        }
    }, [isOpen]);

    const handleAnimationEnd = () => {
        // When the exit animation finishes, unmount the component
        if (!isOpen) {
            setIsRendered(false);
        }
    };

    if (!isRendered) {
        return null;
    }

    return (
        <div 
            className={`fixed inset-0 bg-black z-50 flex justify-center items-center p-4 transition-opacity duration-400 ease-out ${isOpen ? 'bg-opacity-70' : 'bg-opacity-0'}`}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div 
                ref={modalRef}
                className={`bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col relative transition-all duration-400 ease-out ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 motion-safe:scale-95 motion-safe:translate-y-4'}`}
                onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
                onTransitionEnd={handleAnimationEnd}
            >
                <header className="flex items-center justify-between p-6 border-b border-slate-700">
                    <h2 id="modal-title" className="text-2xl font-bold text-amber-400">{title}</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-white transition-all duration-200 ease-out transform motion-safe:hover:scale-110 motion-safe:active:scale-95"
                        aria-label="Close modal"
                    >
                        <XIcon />
                    </button>
                </header>
                <main className="p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Modal;