// https://nextjs.org/docs/basic-features/data-fetching/client-side
import { useState } from 'react';
import { useRouter } from 'next/router'
import Main from "../../components/Main";

import Button from 'react-bootstrap-button-loader';

import { useToastContext } from "../../contexts/ToastContext";
import useProfile from '../../hooks/useProfile';

import UserCard from '../../components/UserCard';

export default function Profile() {
    const router = useRouter();
    const addToast = useToastContext();

    const [loggingOut, setLoggingOut] = useState(false);

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
        await fetch("https://apichessapp.server.ultras-playroom.xyz/login/logout", {
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
          <h2>Profile</h2>
          <p>Username: {user.name}</p>
          <p>Rank: {user.rank}</p>
          <p>Email: {user.email === "" ? "None" : user.email}</p>&nbsp;<Button variant="secondary" size="sm" onClick={() => alert("not implemented yet")}>Change</Button>
          <Button variant="danger" onClick={handleSignOut} loading={loggingOut}>Sign Out</Button>
          <h4 className={"mt-4"}>Card</h4>
          <UserCard
            username={user.name}
            avatarhash={user.avatar_hash}
            rank={user.rank}
          />
        </Main>
      );
    }
}