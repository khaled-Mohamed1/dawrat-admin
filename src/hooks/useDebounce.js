import { useState, useEffect } from 'react';

/**
 * A custom React hook that debounces a value.
 * It delays updating the output value until the input value has stopped changing for a specified time.
 * @param {*} value - The value to debounce (e.g., a search query).
 * @param {number} delay - The delay in milliseconds (e.g., 500).
 * @returns {*} The debounced value.
 */
export const useDebounce = (value, delay) => {
    // State to store the debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set up a timer to update the debounced value after the specified delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clean up the timer if the value changes before the delay has passed.
        // This is the core of the debounce logic. A new timer will be set up above.
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Re-run the effect only if the value or delay changes

    return debouncedValue;
};