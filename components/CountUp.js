// https://w3collective.com/react-stopwatch/
import { useEffect, useState } from 'react';

// https://stackoverflow.com/a/61335543
function secondsToTime(e){
  const h = Math.floor(e / 3600).toString().padStart(2,'0'),
        m = Math.floor(e % 3600 / 60).toString().padStart(2,'0'),
        s = Math.floor(e % 60).toString().padStart(2,'0');
  
  return h + ':' + m + ':' + s;
  //return `${h}:${m}:${s}`;
}

export default function CountUp ({initial, running}) {
    // initial is to be an int
    // running is to be a useState defined from elsewhere
    const [time, setTime] = useState(() => {return initial}); // we only need it once
    useEffect(() => {
      let interval;
      if (running) {
        interval = setInterval(() => {
          setTime((prevTime) => {
            return prevTime + 1;
          });
        }, 1000);
      } else if (!running) {
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    }, [running]);

    return secondsToTime(time);
}
