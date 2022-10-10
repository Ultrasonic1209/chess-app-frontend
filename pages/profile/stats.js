import useSWR from "swr";
import Main from "../../components/Main";
import { fetcher } from "../../hooks/useProfile";

export default function Stats() {

  const { data, error } = useSWR("https://apichessapp.server.ultras-playroom.xyz/user/stats/", fetcher)

    return (
      <Main title="Stats">
        <h2>Stats</h2>
        <p>{JSON.stringify(data)}</p>
        <b>{JSON.stringify(error)}</b>
      </Main>
    );
}