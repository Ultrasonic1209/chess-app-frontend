// https://www.kindacode.com/article/react-check-if-user-device-is-in-dark-mode-light-mode/
// https://stackoverflow.com/a/56198098

import { useState, useEffect, useRef, forwardRef } from "react";
import { WidgetInstance } from "friendly-challenge";

const FriendlyCaptcha = ({ sitekey, doneCallback, errorCallback, startMode }, widget) => {
  const [darkMode, setMode] = useState(false);

  const container = useRef();

  useEffect(() => {
    const _doneCallback = (solution) => {
      if (doneCallback) doneCallback(solution);
    };
  
    const _errorCallback = (err) => {
      if (errorCallback) errorCallback(err);
      console.error("There was an error when trying to solve the Friendly Captcha puzzle.", err);
    };

    if (!widget.current && container.current) {
      widget.current = new WidgetInstance(container.current, {
        startMode: startMode || "none", // You could default to "auto" if you want to start even before interaction
        doneCallback: _doneCallback,
        errorCallback: _errorCallback,
      });
    }

    const updateMode = (event) => {
      const colorScheme = event.matches ? "dark" : "light";
      setMode(colorScheme === "dark");
    }

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', updateMode);

      setMode(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }


    return () => {
      if (widget.current != undefined) widget.current.destroy();

      if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)')
          .removeEventListener('change', updateMode)
      }
    };
  }, [container, doneCallback, errorCallback, startMode, widget]);

  return <div ref={container} className={darkMode ? "frc-captcha dark" : "frc-captcha"} data-sitekey={sitekey} />;
};

export default forwardRef(FriendlyCaptcha);