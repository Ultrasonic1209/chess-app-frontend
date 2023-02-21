// https://gist.github.com/patrickcze/fdccd0e592b32ec4fc5682506c87e5d5#file-app-tsx

import React, { useState, useEffect, useContext } from "react";

const OnlineStatusContext = React.createContext(true);

export const OnlineStatusProvider = ({ children }) => {
  // we check for window because it wont exist on the server, causing an error
  const [onlineStatus, setOnlineStatus] = useState(
    typeof window !== "undefined" && typeof window.navigator !== "undefined"
      ? navigator.onLine
      : true
  );

  useEffect(() => {
    window.addEventListener("offline", () => {
      setOnlineStatus(false);
    });
    window.addEventListener("online", () => {
      setOnlineStatus(true);
    });

    return () => {
      window.removeEventListener("offline", () => {
        setOnlineStatus(false);
      });
      window.removeEventListener("online", () => {
        setOnlineStatus(true);
      });
    };
  }, []);

  return (
    <OnlineStatusContext.Provider value={onlineStatus}>
      {children}
    </OnlineStatusContext.Provider>
  );
};

export const useOnlineStatus = () => {
  const store = useContext(OnlineStatusContext);
  return store;
};
