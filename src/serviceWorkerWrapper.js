// from https://felixgerschau.com/create-a-pwa-update-notification-with-create-react-app/
// needed conversion from typescript
// also needed to make service worker registration work

import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

import * as serviceWorker from './serviceWorkerRegistration';

const ServiceWorkerWrapper = () => {
  const [isOnline, setOnline] = useState(navigator.onLine);

  function updateOnlineStatus(event) {
    setOnline(navigator.onLine);
  }

  window.addEventListener('online',  updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  const [showReload, setShowReload] = React.useState(false);
  const [waitingWorker, setWaitingWorker] = React.useState(null);

  const onSWUpdate = (registration) => {
    setShowReload(true);
    setWaitingWorker(registration.waiting);
    console.log(registration.active);
  };

  useEffect(() => {
    serviceWorker.register({ onUpdate: onSWUpdate });
  }, []);

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    setShowReload(false);
    window.location.reload(true);
  };

  const handleClose = () => setShowReload(false);

  return (
    <Modal
      show={showReload}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
        <Modal.Header closeButton>
            <Modal.Title>Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>An update is available for Checkmate.</Modal.Body>
        <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleClose}
            >
              Dismiss
            </Button>
            <Button
              variant="primary"
              onClick={isOnline? reloadPage: null}
              disabled={!isOnline}
            >
              {isOnline ? 'Update' : 'Offline'}
            </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default ServiceWorkerWrapper;