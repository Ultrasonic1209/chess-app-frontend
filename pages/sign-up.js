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
import useProfile, { url } from "../hooks/useProfile";
import Link from "next/link";

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
    const { loggedOut } = useProfile();

    const handleFormSubmit = async (event, setMessage, resetWidget) => {
      event.preventDefault();

      if (event.target["password"].value != event.target["confirmPassword"].value) {
        setSuccess(false);
        setMessage("Passwords do not equal");
        return;
      }

      setMakingAccount(true);
  
      await fetch("https://apichessapp.server.ultras-playroom.xyz/login/signup", {
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
          setMessage(result.message || "An unknown error occured while creating your account.");
    
          // We should always reset the widget as a solution can not be used twice.
          resetWidget();
        
          if (result.accept) {
            router.push("/sign-in").then(async () => {
              addToast({
                "title": "Checkmate",
                "message": "Account sucessfully created! " + result.message
              });

              await mutate(url, result.profile);
            })
          }
        } else {
          setSuccess(false)
          setMessage("An unknown error occured while creating your account. HTTP " + response.status);
    
          // We should always reset the widget as a solution can not be used twice.
          resetWidget();
        }
      })
      .catch((error) => {
        console.error('Account creation failed', error);
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

            {(!loggedOut) ? (
              <Alert className="mt-3" variant={"warning"}>
                You are already logged into an account! Would you like to <Link href="/profile">sign out</Link>?
              </Alert>
            ) : undefined}

            <FormFloating>
                <FloatingLabel
                    controlId="floatingUsername"
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
                    <Form.Control name="password" type="password" placeholder="password" autoComplete="new-password" required={true} />
                </FloatingLabel>
            </FormFloating>
            <FormFloating>
                <FloatingLabel
                    controlId="floatingPasswordConfirm"
                    label="Confirm Password"
                    className="mb-3 text-muted"
                >
                    <Form.Control name="confirmPassword" type="password" placeholder="confirm password" autoComplete="new-password" required={true} />
                </FloatingLabel>
            </FormFloating>
            <FormFloating>
                <FloatingLabel
                    controlId="floatingEmail"
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

        {(message && !creationSuccess && !makingAccount) ? (
            <Alert className="mt-3" variant={creationSuccess ? "success" : "danger"}>
              {message}
            </Alert>
        ) : undefined}

      </Main>
    );
  } 
