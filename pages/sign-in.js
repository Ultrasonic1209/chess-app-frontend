// from https://getbootstrap.com/docs/5.1/examples/sign-in/
// and https://github.com/FriendlyCaptcha/friendly-captcha-examples/blob/main/nextjs/pages/forms/basic.js

import { useState, useRef } from "react";
import { useRouter } from 'next/router'
import { useSWRConfig } from 'swr'
import { Form, FormFloating, FloatingLabel, Alert } from "react-bootstrap";
import FriendlyCaptcha from "../components/FriendlyCaptcha";
import Button from 'react-bootstrap-button-loader';

import { useToastContext } from "../contexts/ToastContext";

import Main from "../components/Main";


export default function SignIn() {
    const router = useRouter();

    const { mutate } = useSWRConfig()

    const [submitButtonEnabled, setSubmitButtonEnabled] = useState(false);
    const [loginSuccess, setSuccess] = useState(false);
    const [loggingIn, setLoggingIn] = useState(false);
    const [message, setMessage] = useState("");
    
    const widgetRef = useRef();
    const addToast = useToastContext();

    const handleFormSubmit = async (event, setMessage, resetWidget) => {
      event.preventDefault();

      setLoggingIn(true);
  
      await fetch("https://apichessapp.server.ultras-playroom.xyz/login", {
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
        withCredentials: true,
        credentials: 'include',
      })
      .then(async (response) => {
        if (response.ok) {
          const result = await response.json();
          setSuccess(result.accept || false)
          setMessage(result.userFacingMessage || "An unknown error occured while logging you in.");
    
          // We should always reset the widget as a solution can not be used twice.
          resetWidget();
        
          if (result.accept) {
            mutate('https://apichessapp.server.ultras-playroom.xyz/login/identify', result.profile)
            addToast({
              "title": "Checkmate",
              "message": "You have sucessfully logged in."
            });
            router.push("/")
          } else {
            setLoggingIn(false);
          }
        } else {
          setSuccess(false)
          setMessage("An unknown error occured while logging you in. HTTP " + response.status);
          setLoggingIn(false);
    
          // We should always reset the widget as a solution can not be used twice.
          resetWidget();
        }
      })
      .catch( (error) => {
        console.error('Log-in failed', error);
        setSuccess(false);
        setMessage("An unknown error occured while connecting to the server.")
        setLoggingIn(false);
      })
    

    };

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
                    <Form.Control name="username" type="text" placeholder="Username" autoComplete="username" required={true} />
                </FloatingLabel>
            </FormFloating>
            <FormFloating>
                <FloatingLabel
                    controlId="floatingPassword"
                    label="Password"
                    className="mb-3 text-muted"
                >
                    <Form.Control name="password" type="password" placeholder="password" autoComplete="current-password" required={true} />
                </FloatingLabel>
            </FormFloating>

            <div className="mb-2 mt-3">
                <Form.Check
                    type="checkbox"
                    
                    title="Remember me"
                    label={'Remember Me'}

                    value="remember-me"
                    name="remember-me"
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
            <Button loading={loggingIn} disabled={!submitButtonEnabled} className="w-100 btn btn-lg btn-primary mt-2" type="submit">Sign in</Button>
            <Form.Text className="text-muted">
              By signing in, you agree to cookies being stored on your computer.
            </Form.Text>
        </Form>

        {(message && !loginSuccess) ? (
            <Alert className="mt-3" variant={loginSuccess ? "success" : "danger"}>
              {message}
            </Alert>
        ) : undefined}

      </Main>
    );
  } 
