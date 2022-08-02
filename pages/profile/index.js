// https://nextjs.org/docs/basic-features/data-fetching/client-side
import { useRouter } from 'next/router'
import Main from "../../components/Main";
import useSWR from 'swr'

import { Button } from 'react-bootstrap';

import { useToastContext } from "../../contexts/ToastContext";
import { useState } from 'react';

const fetcher = url => fetch(url, {withCredentials: true, credentials: 'include'}).then(r => r.json())
export default function Profile() {
    const router = useRouter();
    const addToast = useToastContext();

    const [shouldUpdate, setShouldUpdate] = useState(true);

    const { data, error, mutate } = useSWR(shouldUpdate ? 'https://apichessapp.server.ultras-playroom.xyz/login/identify' : null, fetcher)

    if (error) {
      return (
        <Main title="Profile">
          <h2>Profile</h2>
          <p>An error occured loading profile information.</p>
        </Main>
      )
    }
    else if (!data) {
      return (
        <Main title="Profile">
          <h2>Profile</h2>
          <p>Loading...</p>
        </Main>
      )
    }
    else if (!data.name) {
      router.push("/sign-in")
      return (
        <Main title="Sign in">
        </Main>
      )
    }
    else {

      const handleSignOut = async () => {
        await fetch("https://apichessapp.server.ultras-playroom.xyz/login/logout", {
          method: "DELETE",
          withCredentials: true,
          credentials: 'include'
        })
        .then(async (response) => {
          if (response.ok) {
            setShouldUpdate(false)
            mutate({})
            addToast({
              "title": "Checkmate",
              "message": "You have sucessfully logged out."
            });
            router.push("/")
          } else {
            console.error("Failed to sign-out! (Server Error)", response)
            alert("An internal server error occured.")
          }
        })
        .catch( (error) => {
          console.error("Failed to sign-out!", error)
          alert("An error occured.")
        })
      }
      return (
        <Main title="Profile">
          <h2>Profile</h2>
          <p>Username: {data.name}</p>
          <Button variant="danger" onClick={handleSignOut}>Sign Out</Button>
        </Main>
      );
    }
}