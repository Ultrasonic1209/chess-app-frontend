import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

// from https://github.com/shadowwalker/next-pwa/blob/master/examples/lifecycle/pages/index.js
const SWWrapper = () => {
    
  const [showUpdate, setShowUpdate] = useState(false);

  const [isOnline, setOnline] = useState(false);

  function updateOnlineStatus(event) {
    setOnline(navigator.onLine);
  }

  // This hook only run once in browser after the component is rendered for the first time.
  // It has same effect as the old componentDidMount lifecycle callback.

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.workbox !== undefined) {
    
      window.addEventListener('online',  updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);

      updateOnlineStatus();

      const wb = window.workbox
      // add event listeners to handle any of PWA lifecycle event
      // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-window.Workbox#events
      wb.addEventListener('installed', event => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })

      wb.addEventListener('controlling', event => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })

      wb.addEventListener('activated', event => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })

      // A common UX pattern for progressive web apps is to show a banner when a service worker has updated and waiting to install.
      // NOTE: MUST set skipWaiting to false in next.config.js pwa object
      // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
      const promptNewVersionAvailable = event => {
        // `event.wasWaitingBeforeRegister` will be false if this is the first time the updated service worker is waiting.
        // When `event.wasWaitingBeforeRegister` is true, a previously updated service worker is still waiting.
        // You may want to customize the UI prompt accordingly.
        setShowUpdate(true);
      }

      wb.addEventListener('waiting', promptNewVersionAvailable)

      // ISSUE - this is not working as expected, why?
      // I could only make message event listenser work when I manually add this listenser into sw.js file
      wb.addEventListener('message', event => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })

      /*
      wb.addEventListener('redundant', event => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })
      wb.addEventListener('externalinstalled', event => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })
      wb.addEventListener('externalactivated', event => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })
      */

      // never forget to call register as auto register is turned off in next.config.js
      wb.register()
    }
  })

  const handleClose = () => setShowUpdate(false)

  const startUpdate = () => {
    const wb = window.workbox

    wb.addEventListener('controlling', event => {
      window.location.reload()
    })

    // Send a message to the waiting service worker, instructing it to activate.
    wb.messageSkipWaiting()
    handleClose()
  }
    
  return (
    <Modal
      show={ showUpdate }
      onHide={ handleClose }
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
              onClick={isOnline ? startUpdate : null}
              disabled={!isOnline}
            >
              {isOnline ? 'Update' : 'Offline'}
            </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default SWWrapper;