// https://usehooks.com/useLocalStorage/

import { useCallback, useEffect, useState } from "react";

export default function useLocalStorage(key, initialValue) {

  // Defining this seperately from the example...
  const getCurrentValue = useCallback(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  }, [key, initialValue])

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(getCurrentValue);
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  // So the value updates after the webpage has been hydrated!
  // this was a pain to debug.
  useEffect(() => setValue(() => {
    const value = getCurrentValue()
    console.log("setting to", value);
  }), [])

  return [storedValue, setValue];
}
