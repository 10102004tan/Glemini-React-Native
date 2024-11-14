import {useCallback, useRef} from 'react';

const useDebounce = (func, delay) => {
    const debounceTimeout = useRef(null);

    return useCallback((...args) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            func(...args);
        }, delay);
    }, [func, delay]);
};

export default useDebounce;