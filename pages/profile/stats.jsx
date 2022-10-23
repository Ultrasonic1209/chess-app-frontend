import useSWR from "swr";
import Main from "../../components/Main";
import { fetcher } from "../../hooks/useProfile";

import { db } from "../../db";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";

import { Tab, Tabs } from "react-bootstrap";

export default function Stats() {

  const [gamemode, setGamemode] = useState("BOT")

  const { data: netstats, error: neterror } = useSWR(gamemode === "NET" ? "https://apichessapp.server.ultras-playroom.xyz/user/stats/" : undefined, fetcher)

  const localQuery = useLiveQuery(async () => {
    if ((typeof gamemode === "undefined") || (gamemode === "NET")) { return [] }

    const amountOfGames = await db.table("games").where({
      gameType: gamemode
    }).count();

    const amountOfGamesWhite = await db.table("games").where({
      gameType: gamemode,
      colourPlaying: "WHITE"
    }).count();

    return {
      games_played: amountOfGames,
      games_won: 0,
      percentage_of_starting_white: (amountOfGamesWhite / amountOfGames) * 100
    }
  }, [gamemode]);

  return (
    <Main title="Stats">
      <h2>Stats</h2>
      <h3>Global stats</h3>
      <p>we&rsquo;ll... be right back!</p>
      <h3>Category stats</h3>
      <Tabs
        id="controlled-tab-example"
        activeKey={gamemode}
        onSelect={(k) => setGamemode(k)}
        className="mb-3"
      >
        <Tab eventKey="BOT" title="Bot">
          {localQuery
          ? <>
            <p>Games played: {localQuery.games_played}</p>
            <p>Games won: {localQuery.games_won} {((localQuery.games_won / localQuery.games_played) * 100).toFixed(2)}%</p>
            <p>Percentage of games played as white: {(localQuery.percentage_of_starting_white).toFixed(2)}%</p>
          </>
          : <b>Loading</b>
          }

          <p>{JSON.stringify(localQuery)}</p>
        </Tab>
        <Tab eventKey="LOCAL" title="Local">
          <p>{JSON.stringify(localQuery)}</p>
        </Tab>
        <Tab eventKey="NET" title="Online">
          <p>{JSON.stringify(netstats)}</p>
          <b>{JSON.stringify(neterror)}</b>
        </Tab>
      </Tabs>
    </Main>
  );
}