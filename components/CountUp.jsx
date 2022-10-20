// https://w3collective.com/react-stopwatch/
import { useEffect, forwardRef } from 'react';

// https://stackoverflow.com/a/7343013/
export const round = (value, precision) => {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

// https://stackoverflow.com/a/61335543
export const secondsToTime = (e) => {
  const h = Math.floor(e / 3600).toString().padStart(2,'0'),
        m = Math.floor(e % 3600 / 60).toString().padStart(2,'0'),
        s = Math.floor(e % 60);
  
  return h + ':' + m + ':' + round(s + (e - parseInt(e)), 1).toFixed(1).padStart(4,'0');
  //return `${h}:${m}:${s}`;
}

const CountUp = forwardRef(({getTime, setTime, running}, ref) => {
  // running is to be a useState defined from elsewhere

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          return round(prevTime + 0.1, 1);
        });
      }, 100);
    } else if (!running) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running, setTime]);

  return <span ref={ref} data-time={getTime}>{secondsToTime(getTime)}</span>;
});

CountUp.displayName = "CountUp";

export default CountUp;