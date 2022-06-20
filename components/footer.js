import { Popover, OverlayTrigger } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';

const GIT_TAG = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;

var VERSION;
if (GIT_TAG === undefined) {
    VERSION = "Unknown";
} else {
    VERSION = GIT_TAG.substring(0,7);
}

// footer from https://getbootstrap.com/docs/5.1/examples/footers/ - first example
export default function Footer() {

    const popover = (
      <Popover id="popover-version">
        <Popover.Header as="h3">Version</Popover.Header>
        <Popover.Body>
          Description: {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE}
          <br/>
          Last updated: {process.env.lastModified}
        </Popover.Body>
      </Popover>
    );

    return (
        <Container>
          <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-1S border-top">
            <p className="col-md-4 d-flex align-items-center mb-3 mb-md-0 me-md-auto text-muted">&copy; lol no</p>

            <p className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto text-muted text-decoration-none">
              {process.env.appName}
            </p>

            
            <div className="col-md-4 d-flex mb-0 align-items-center justify-content-end text-muted">
              <OverlayTrigger placement="left" overlay={popover}>
               <p className="mb-0">
                Version {VERSION}
               </p>
              </OverlayTrigger>
            </div>
        </footer>
      </Container>
    )
}
