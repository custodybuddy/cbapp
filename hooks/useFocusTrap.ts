import React, { useEffect, useRef } from 'react';

/**
 * A custom hook to manage focus trapping within a modal dialog for accessibility.
 *
 * @param modalRef - A React ref attached to the modal container element.
 * @param isOpen - A boolean indicating if the modal is currently open.
 * @param onClose - A callback function to close the modal.
 */
export const useFocusTrap = (
    modalRef: React.RefObject<HTMLElement>,
    isOpen: boolean,
    onClose: () => void
) => {
    const triggerElementRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            // Store the element that had focus before the modal opened
            triggerElementRef.current = document.activeElement as HTMLElement;

            const modalNode = modalRef.current;
            if (!modalNode) return;

            // Find all focusable elements within the modal
            const focusableElements = modalNode.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            // Move focus to the first focusable element in the modal
            firstElement?.focus();

            const handleKeyDown = (e: KeyboardEvent) => {
                // Close modal on Escape key press
                if (e.key === 'Escape') {
                    onClose();
                    return;
                }

                // Trap focus within the modal on Tab key press
                if (e.key === 'Tab') {
                    if (e.shiftKey) { // Shift + Tab
                        if (document.activeElement === firstElement) {
                            lastElement?.focus();
                            e.preventDefault();
                        }
                    } else { // Tab
                        if (document.activeElement === lastElement) {
                            firstElement?.focus();
                            e.preventDefault();
                        }
                    }
                }
            };

            document.addEventListener('keydown', handleKeyDown);

            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                // Restore focus to the element that triggered the modal
                triggerElementRef.current?.focus();
            };
        }
    }, [isOpen, modalRef, onClose]);
};
