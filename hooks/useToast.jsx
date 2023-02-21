import { useState } from "react";
import RBToast from "react-bootstrap/Toast";

// https://react-bootstrap.netlify.app/components/toasts/#autohide

export default function Toast(props) {
  const [show, setShow] = useState(true);

  const title = props.title;
  const message = props.message;

  return (
    <RBToast onClose={() => setShow(false)} show={show}>
      <RBToast.Header closeButton={true}>
        <strong className="me-auto">{title ? title : "Title Missing"}</strong>
      </RBToast.Header>
      <RBToast.Body>{message ? message : "Message Missing"}</RBToast.Body>
    </RBToast>
  );
}
