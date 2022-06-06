// from https://felixgerschau.com/create-a-pwa-update-notification-with-create-react-app/
// needed conversion from typescript
// also needed to make service worker registration work

import React from 'react';
import { Modal, Button } from 'react-bootstrap';

import * as serviceWorker from './serviceWorkerRegistration';

class ServiceWorkerWrapper extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      online: navigator.onLine,
      showReload: true,
      waitingWorker: null
    };

    window.addEventListener('online',  this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);

    serviceWorker.register({ onUpdate: this.onSWUpdate });
  }

  updateOnlineStatus = (event) => {
    this.setState({ online : navigator.onLine });
  }

  onSWUpdate = (registration) => {
    this.setState({ showReload: true });
    this.waitingWorker = registration.waiting;
    console.log(registration.active);
  };

  componentDidMount() {
  }

  reloadPage = () => {
    this.state.waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    this.handleClose()
    window.location.reload(true);
  };

  handleClose = () => { this.setState({ showReload: false })};

  render() {
    return (
      <Modal
        show={ this.state.showReload }
        onHide={ this.handleClose }
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
                onClick={this.handleClose}
              >
                Dismiss
              </Button>
              <Button
                variant="primary"
                onClick={this.state.online ? this.reloadPage : null}
                disabled={!this.state.online}
              >
                {this.state.online ? 'Update' : 'Offline'}
              </Button>
          </Modal.Footer>
      </Modal>
    )
  }
}

export default ServiceWorkerWrapper;