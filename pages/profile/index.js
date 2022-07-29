// https://nextjs.org/docs/basic-features/data-fetching/client-side
import Main from "../../components/Main";
import useSWR from 'swr'

const fetcher = url => fetch(url, {withCredentials: true, credentials: 'include'}).then(r => r.json())
export default function Profile() {
    const { data, error } = useSWR('https://apichessapp.server.ultras-playroom.xyz/login/identify', fetcher)

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
      return (
        <Main title="Profile">
          <h2>Profile</h2>
          <p>Loading...</p>
        </Main>
      )
    }
    else {
      return (
        <Main title="Profile">
          <h2>Profile</h2>
          <p>Username: {data.username}</p>
        </Main>
      );
    }
}