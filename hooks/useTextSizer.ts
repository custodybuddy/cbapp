import { useState, useEffect, useCallback } from 'react';

const FONT_SCALE_KEY = 'custodybuddy-font-scale';
export const MIN_SCALE = 0.8;
export const MAX_SCALE = 1.4;
const STEP = 0.1;
const DEFAULT_SCALE = 1.0;

export const useTextSizer = () => {
    const [scale, setScale] = useState<number>(() => {
        try {
            const savedScale = localStorage.getItem(FONT_SCALE_KEY);
            // round to two decimal places to avoid floating point issues from storage
            return savedScale ? parseFloat(parseFloat(savedScale).toFixed(2)) : DEFAULT_SCALE;
        } catch (error) {
            return DEFAULT_SCALE;
        }
    });

    useEffect(() => {
        // Apply the scale to the root element to be inherited by all components
        document.documentElement.style.setProperty('--font-scale-factor', scale.toString());
        
        try {
            localStorage.setItem(FONT_SCALE_KEY, scale.toString());
        } catch (error) {
            console.error("Failed to save font scale to localStorage", error);
        }
    }, [scale]);

    const increase = useCallback(() => {
        setScale(currentScale => {
            const newScale = parseFloat((currentScale + STEP).toFixed(2));
            return Math.min(MAX_SCALE, newScale);
        });
    }, []);

    const decrease = useCallback(() => {
        setScale(currentScale => {
            const newScale = parseFloat((currentScale - STEP).toFixed(2));
            return Math.max(MIN_SCALE, newScale);
        });
    }, []);

    const reset = useCallback(() => {
        setScale(DEFAULT_SCALE);
    }, []);

    return { scale, increase, decrease, reset };
};