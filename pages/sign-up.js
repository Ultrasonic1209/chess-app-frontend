// from https://getbootstrap.com/docs/5.1/examples/sign-in/
// and https://github.com/FriendlyCaptcha/friendly-captcha-examples/blob/main/nextjs/pages/forms/basic.js

import { useState, useRef, Suspense } from "react";

import { useRouter } from 'next/router'
import dynamic from "next/dynamic";
import { useSWRConfig } from 'swr'

import { Form, FormFloating, FloatingLabel, Alert } from "react-bootstrap";
import Button from 'react-bootstrap-button-loader';

import { useToastContext } from "../contexts/ToastContext";
import Main from "../components/Main";
import { url } from "../hooks/useProfile";

const FriendlyCaptcha = dynamic(() =>
  import('../components/FriendlyCaptcha'),
  {
    suspense: true
  }
)

export default function SignUp() {
    const router = useRouter();

    const { mutate } = useSWRConfig()

    const [submitButtonEnabled, setSubmitButtonEnabled] = useState(false);
    const [creationSuccess, setSuccess] = useState(false);
    const [makingAccount, setMakingAccount] = useState(false);
    const [message, setMessage] = useState("");
    
    const widgetRef = useRef();
    const addToast = useToastContext();

    const handleFormSubmit = async (event, setMessage, resetWidget) => {
      event.preventDefault();

      setMakingAccount(true);
  
      await fetch("https://apichessapp.server.ultras-playroom.xyz/login/create", {
        body: JSON.stringify({
          username: event.target["username"].value,
          password: event.target["password"].value,
          email: event.target["email"].value,
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
            router.push("/").then(async () => {
              addToast({
                "title": "Checkmate",
                "message": "You have sucessfully logged in."
              });

              await mutate(url, result.profile);
            })
          }
        } else {
          setSuccess(false)
          setMessage("An unknown error occured while logging you in. HTTP " + response.status);
    
          // We should always reset the widget as a solution can not be used twice.
          resetWidget();
        }
      })
      .catch((error) => {
        console.error('Log-in failed', error);
        setSuccess(false);
        setMessage("An unknown error occured while connecting to the server.")
      })
      .finally(() => setMakingAccount(false));
    

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
      <Main title="Sign up">
        <Form name="sign-up" onSubmit={(ev) => handleFormSubmit(ev, setMessage, reset)}>
            <h1 className="h3 mb-3 fw-normal">Sign up</h1>

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
            <FormFloating>
                <FloatingLabel
                    controlId="floatingInput"
                    label="E-mail address"
                    className="mb-3 text-muted"
                >
                    <Form.Control name="email" type="email" placeholder="email@address.com" autoComplete="email" required={false} />
                </FloatingLabel>
            </FormFloating>

            <Suspense fallback={`Loading captcha`}>
              <FriendlyCaptcha
                  ref={widgetRef}
                  sitekey={process.env.friendlyCaptchaSitekey}
                  doneCallback={() => setSubmitButtonEnabled(true)}
                  errorCallback={(err) => {
                      setMessage("Anti-robot widget issue" + JSON.stringify(err)); // Should really never happen.
                      setSubmitButtonEnabled(true);
                  }}
              />
            </Suspense>
            <Button loading={makingAccount} disabled={!submitButtonEnabled} className="w-100 btn btn-lg btn-primary mt-2" type="submit">Create Account</Button>
            <Form.Text className="text-muted">
              By creating an account, you agree to cookies being stored on your computer.
            </Form.Text>
        </Form>

        {(message && !creationSuccess) ? (
            <Alert className="mt-3" variant={creationSuccess ? "success" : "danger"}>
              {message}
            </Alert>
        ) : undefined}

      </Main>
    );
  } 
