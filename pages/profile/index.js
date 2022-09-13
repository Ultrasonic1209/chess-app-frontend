// https://nextjs.org/docs/basic-features/data-fetching/client-side
import { useRouter } from 'next/router'
import Main from "../../components/Main";
import useSWR from 'swr'

import Button from 'react-bootstrap-button-loader';

import { useToastContext } from "../../contexts/ToastContext";
import { useState } from 'react';
import { fetcher } from '../../hooks/useProfile';

export default function Profile() {
    const router = useRouter();
    const addToast = useToastContext();

    const [shouldUpdate, setShouldUpdate] = useState(true);

    const [loggingOut, setLoggingOut] = useState(false);

    const { data, error, isValidating, mutate } = useSWR(shouldUpdate ? 'https://apichessapp.server.ultras-playroom.xyz/login/identify' : null, fetcher)

    if (error) {
      return (
        <Main title="Profile">
          <h2>Profile</h2>
          <p>An error occured loading profile information.</p>
        </Main>
      )
    }
    else if (!data && isValidating) { // state changes are async, would prefer to avoid content flashes
      return (
        <Main title="Profile">
          <h2>Profile</h2>
          <p>Loading...</p>
        </Main>
      )
    }
    else if (!data.name && shouldUpdate) {
      router.push("/sign-in")
      return (
        <Main title="Sign in">
        </Main>
      )
    }
    else {

      const handleSignOut = async () => {
        setLoggingOut(true)
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
        .finally(() => setLoggingOut(false))
      }
      return (
        <Main title="Profile">
          <h2>Profile</h2>
          <p>Username: {data.name}</p>
          <Button variant="danger" onClick={handleSignOut} loading={loggingOut}>Sign Out</Button>
        </Main>
      );
    }
}