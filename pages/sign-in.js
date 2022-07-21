// from https://getbootstrap.com/docs/5.1/examples/sign-in/
// and https://github.com/FriendlyCaptcha/friendly-captcha-examples/blob/main/nextjs/pages/forms/basic.js

import { useState, useRef } from "react";
import { Button, Form, FormFloating, FloatingLabel, Alert } from "react-bootstrap";
import FriendlyCaptcha from "../components/FriendlyCaptcha";
import Main from "../components/main";

const handleFormSubmit = async (event, setMessage, resetWidget) => {
    event.preventDefault();
  
    console.log(event)

    const res = await fetch("https://apichessapp.server.ultras-playroom.xyz/login", {
      body: JSON.stringify({
        username: event.target["username"].value,
        password: event.target["password"].value,
        rememberMe: event.target["remember-me"].checked,
        frcCaptchaSolution: event.target["frc-captcha-solution"].value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  
    const result = await res.json(); // The endpoint currently returns `{msg: "some message"}
    setMessage(result.userFacingMessage);
  
    // We should always reset the widget as a solution can not be used twice.
    resetWidget();
};

export default function SignIn() {
    const [submitButtonEnabled, setSubmitButtonEnabled] = useState(false);
    const [message, setMessage] = useState("");
    const widgetRef = useRef();
    const reset = () => {
      setSubmitButtonEnabled(false);
      if (widgetRef.current) {
        // The type of widgetRef.current is WidgetInstance, see the JS API details here:
        // https://docs.friendlycaptcha.com/#/widget_api?id=javascript-api
        widgetRef.current.reset();
      }
    };
    return (
      <Main title="Sign in">
        <Form name="sign-in" onSubmit={(ev) => handleFormSubmit(ev, setMessage, reset)}>
            <h1 className="h3 mb-3 fw-normal">Sign in</h1>

            <FormFloating>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Username"
                    className="mb-3 text-muted"
                >
                    <Form.Control name="username" type="text" placeholder="Username" required={true} />
                </FloatingLabel>
            </FormFloating>
            <FormFloating>
                <FloatingLabel
                    controlId="floatingPassword"
                    label="Password"
                    className="mb-3 text-muted"
                >
                    <Form.Control name="password" type="password" placeholder="password" required={true} />
                </FloatingLabel>
            </FormFloating>

            <div className="mb-3 mt-3">
                <Form.Check
                    type="checkbox"
                    
                    title="Remember me"
                    label={"Remember me"}

                    value="remember-me"
                    name="remember-me"
                    placeholder="remember-me"
                />
            </div>

            <FriendlyCaptcha
                ref={widgetRef}
                sitekey={process.env.friendlyCaptchaSitekey}
                doneCallback={() => setSubmitButtonEnabled(true)}
                errorCallback={(err) => {
                    setMessage("Anti-robot widget issue" + JSON.stringify(err)); // Should really never happen.
                    setSubmitButtonEnabled(true);
                }}
            ></FriendlyCaptcha>
            <Button disabled={submitButtonEnabled ? undefined : "null"} className="w-100 btn btn-lg btn-primary mt-2" type="submit">Sign in</Button>
        </Form>

        {message ? (
            <Alert className="mt-3" variant="primary">
            <p>{message}</p>
            </Alert>
        ) : undefined}

      </Main>
    );
  } 
