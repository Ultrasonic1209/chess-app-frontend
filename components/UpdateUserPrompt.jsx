import { useState } from "react";

import {
  Modal,
  Form,
  FormFloating,
  FloatingLabel,
  Alert,
} from "react-bootstrap";
import Button from "react-bootstrap-button-loader";

import { useToastContext } from "../contexts/ToastContext";
import useProfile from "../hooks/useProfile";

async function updateUser(old_password, new_password, new_email) {
  const toreturn = await fetch(
    `https://apichessapp.server.ultras-playroom.xyz/user/update`,
    {
      body: JSON.stringify({
        old_password: old_password,
        new_password: new_password,
        new_email: new_email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
      withCredentials: true,
      credentials: "include",
    }
  )
    .catch((exc) => {
      console.error(exc);
      return {
        success: false,
        message: "An error occured while connecting to the server.",
        newUser: null,
      };
    })
    .then(async (response) => {
      const body = (await response?.json()) || {};

      return {
        success: response.ok,
        message: body.message || "No message was recieved from the server.",
        newUser: body.profile,
      };
    });

  return toreturn;
}

export default function UpdateUserPrompt({ show, handleClose }) {
  const addToast = useToastContext();

  const { user, mutate } = useProfile();

  const [changingPassword, setChangingPassword] = useState(false);

  const [message, setMessage] = useState(null);

  const [updating, setUpdating] = useState(false);

  function closeModal() {
    setMessage(null);
    setChangingPassword(null);
    handleClose();
  }

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    const { currentPassword, newPassword, confirmNewPassword, email } =
      ev.target;

    if (!(newPassword.value === confirmNewPassword.value)) {
      setMessage("New passwords do not match.");
      return false;
    }

    setUpdating(true);
    const resp = await updateUser(
      currentPassword.value,
      newPassword.value,
      email.value
    );
    setUpdating(false);

    if (resp.newUser) {
      await mutate(resp.newUser);
    }

    if (resp.success) {
      addToast({
        title: "Checkmate",
        message: "Sucessfully updated settings!",
      });
      closeModal();
    } else {
      setMessage(resp.message || "An unknown error has occured.");
    }

    return resp.success;
  }

  // the readonly/hidden `username` field is for accessibility reasons

  return (
    <Modal show={show} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Update User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          name="update-user"
          id="update-user-form"
          onSubmit={handleFormSubmit}
        >
          <FormFloating className={"d-none"}>
            <FloatingLabel
              controlId="username"
              label="Username"
              className="mb-3 text-muted"
            >
              <Form.Control
                name="username"
                type="text"
                placeholder="username"
                autoComplete="username"
                required={true}
                value={user?.name}
                readOnly={true}
              />
            </FloatingLabel>
          </FormFloating>
          <FormFloating>
            <FloatingLabel
              controlId="currentPassword"
              label="Current Password"
              className="mb-3 text-muted"
            >
              <Form.Control
                name="currentPassword"
                type="password"
                placeholder="current password"
                autoComplete="current-password"
                required={true}
              />
            </FloatingLabel>
          </FormFloating>
          <FormFloating>
            <FloatingLabel
              controlId="newPassword"
              label="New Password"
              className="mb-3 text-muted"
            >
              <Form.Control
                name="newPassword"
                type="password"
                placeholder="new password"
                autoComplete="new-password"
                onChange={(ev) =>
                  setChangingPassword(!(ev.target.value === ""))
                }
                required={false}
              />
            </FloatingLabel>
          </FormFloating>
          <FormFloating className={changingPassword ? undefined : "d-none"}>
            <FloatingLabel
              controlId="confirmNewPassword"
              label="Confirm Password"
              className="mb-3 text-muted"
            >
              <Form.Control
                name="confirmNewPassword"
                type="password"
                placeholder="confirm new password"
                autoComplete="new-password"
                required={changingPassword}
                value={changingPassword ? undefined : ""}
                readOnly={!changingPassword}
              />
            </FloatingLabel>
          </FormFloating>
          <FormFloating>
            <FloatingLabel
              controlId="newEmail"
              label="New E-mail address"
              className="mb-3 text-muted"
            >
              <Form.Control
                name="email"
                type="email"
                placeholder="email@address.com"
                autoComplete="email"
                required={false}
              />
            </FloatingLabel>
          </FormFloating>
        </Form>
        {message ? (
          <Alert className="mt-3" variant={"danger"}>
            {message}
          </Alert>
        ) : undefined}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button
          variant="primary"
          type="submit"
          form="update-user-form"
          loading={updating}
          spinAlignment={"right"}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
