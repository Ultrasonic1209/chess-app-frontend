// https://codesandbox.io/s/react-toasts-melne?from-embed=&file=/src/contexts/ToastContext.js:0-808
import React from 'react';
import { useCallback, useContext, useState, createContext, Fragment } from "react";
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from '../components/Toast';

const ToastContext = createContext();

export default ToastContext;

export function ToastContextProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    function (toast) {
      setToasts((toasts) => [...toasts, toast]);
    },
    [setToasts]
  );

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <ToastContainer id="toastContainer" className="p-3" position='bottom-end'>
        {toasts.map((toast, i) => ( // using array keys is officially seen as a last resort. maybe long-term switch to uuids?
            <Fragment key={i}>
                <Toast title={toast.title} message={toast.message}/>
            </Fragment>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  return useContext(ToastContext);
}
