// https://www.kindacode.com/article/react-check-if-user-device-is-in-dark-mode-light-mode/
// https://stackoverflow.com/a/56198098
// https://fettblog.eu/typescript-react-generic-forward-refs/

/* eslint-disable no-unused-vars */
type FriendlyCaptchaProps = {
  sitekey: string;
  doneCallback: (solution: string) => any;
  errorCallback: (error: any) => any;
  startMode?: "auto" | "focus" | "none";
};
/* eslint-enable no-unused-vars */

import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  MutableRefObject,
} from "react";
import { WidgetInstance } from "friendly-challenge";

const FriendlyCaptcha = (
  {
    sitekey,
    doneCallback,
    errorCallback,
    startMode = "none",
  }: FriendlyCaptchaProps,
  widget: MutableRefObject<WidgetInstance>
) => {
  const [darkMode, setMode] = useState(false);

  const container = useRef();
  const _doneCallback = (solution: string) => {
    if (doneCallback) doneCallback(solution);
  };

  const _errorCallback = (err: any) => {
    if (errorCallback) errorCallback(err);
    console.error(
      "There was an error when trying to solve the Friendly Captcha puzzle.",
      err
    );
  };

  useEffect(() => {
    if (!widget.current && container.current) {
      widget.current = new WidgetInstance(container.current, {
        startMode: startMode, // You could default to "auto" if you want to start even before interaction
        doneCallback: _doneCallback,
        errorCallback: _errorCallback,
      });
    }

    const updateMode = (event) => setMode(event.matches);

    window
      .matchMedia?.("(prefers-color-scheme: dark)")
      .addEventListener("change", updateMode);

    setMode(
      window.matchMedia?.("(prefers-color-scheme: dark)").matches || false
    );

    return () => {
      if (widget.current != undefined) widget.current.destroy();

      window
        .matchMedia?.("(prefers-color-scheme: dark)")
        .removeEventListener("change", updateMode);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container]);

  return (
    <div
      ref={container}
      className={darkMode ? "frc-captcha dark" : "frc-captcha"}
      data-sitekey={sitekey}
    />
  );
};

export default forwardRef(FriendlyCaptcha);
