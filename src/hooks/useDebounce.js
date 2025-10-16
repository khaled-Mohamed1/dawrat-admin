import { useState, useEffect } from 'react';

/**
 * A custom React hook that debounces a value.
 * It delays updating the output value until the input value has stopped changing for a specified time.
 * @param {*} value - The value to debounce (e.g., a search query).
 * @param {number} delay - The delay in milliseconds (e.g., 500).
 * @returns {*} The debounced value.
 */
export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};