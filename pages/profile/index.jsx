// https://nextjs.org/docs/basic-features/data-fetching/client-side
import { useState } from 'react';
import { useRouter } from 'next/router'
import Main from "../../components/Main";

import Button from 'react-bootstrap-button-loader';

import { useToastContext } from "../../contexts/ToastContext";
import useProfile from '../../hooks/useProfile';

import UserCard from '../../components/UserCard';
import Link from 'next/link';
import UpdateUserPrompt from '../../components/UpdateUserPrompt';
import { ButtonToolbar } from 'react-bootstrap';

export default function Profile() {
    const router = useRouter();
    const addToast = useToastContext();

    const [loggingOut, setLoggingOut] = useState(false);

    const [userPromptOpen, setUserPromptOpen] = useState(false);

    const { user, error, loading, mutate, loggedOut } = useProfile()

    if (error) {
      return (
        <Main title="Profile">
          <h2>Profile</h2>
          <p>An error occured loading profile information.</p>
        </Main>
      )
    }
    else if (loading) {
      return (
        <Main title="Profile">
          <h2>Profile</h2>
          <p>Loading...</p>
        </Main>
      )
    }
    else if (loggedOut) {
      router.replace("/sign-in")
      return (
        <Main title="Sign in">
        </Main>
      )
    }
    else {

      const handleSignOut = async () => {
        setLoggingOut(true)
        await fetch("https://apichessapp.server.ultras-playroom.xyz/user/logout", {
          method: "DELETE",
          withCredentials: true,
          credentials: 'include'
        })
        .then(async (response) => {
          if (response.ok) {
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
          <UpdateUserPrompt show={userPromptOpen} handleClose={() => setUserPromptOpen(false)}/>
          <h2>Profile</h2>
          <p>Username: {user.name}</p>
          <p>Rank: {user.rank}</p>
          <p className={"mb-0"}>Email: {user.email === "" ? "None" : user.email}</p>&nbsp;

          <br/>

          <ButtonToolbar className={"mb-2"} aria-label={"Share options"}>
            <Button
              className={"me-2"}
              variant="secondary"
              onClick={() => setUserPromptOpen(true)}
            >Edit User</Button>
            <Button
              className={"me-2"}
              variant="danger"
              onClick={handleSignOut}
              loading={loggingOut}
            >Sign Out</Button>
          </ButtonToolbar>

          <h4 className={"mt-4"}>Card</h4>
          <UserCard
            username={user.name}
            avatarhash={user.avatar_hash}
            rank={user.rank}
          />
          <p className={"mb-0"}>Want to customise your avatar? Create a <Link href={"https://gravatar.com/"}>Gravatar</Link></p>
          <small>Custom avatars will only be displayed if they are rated PG.</small>
        </Main>
      );
    }
}