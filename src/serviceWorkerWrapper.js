// from https://felixgerschau.com/create-a-pwa-update-notification-with-create-react-app/
// needed conversion from typescript
// also needed to make service worker registration work

import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

import * as serviceWorker from './serviceWorkerRegistration';

const ServiceWorkerWrapper = () => {
  const [showReload, setShowReload] = React.useState(false);
  const [waitingWorker, setWaitingWorker] = React.useState(null);

  const onSWUpdate = (registration) => {
    setShowReload(true);
    setWaitingWorker(registration.waiting);
  };

  useEffect(() => {
    serviceWorker.register({ onUpdate: onSWUpdate });
  }, []);

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    setShowReload(false);
    window.location.reload(true);
  };

  const handleClose = () => setShow(false);

  /*return (
    <Snackbar
      open={showReload}
      message="A new version is available!"
      onClick={reloadPage}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      action={
        <Button
          color="inherit"
          size="small"
          onClick={reloadPage}
        >
          Reload
        </Button>
      }
    />
  );*/

  return (
    <Modal show={showReload} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>An update is available for Checkmate.</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Dismiss
            </Button>
            <Button variant="primary" onClick={reloadPage}>
                Update
            </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default ServiceWorkerWrapper;