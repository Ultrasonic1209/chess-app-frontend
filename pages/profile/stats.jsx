import useSWR from "swr";
import Main from "../../components/Main";
import { fetcher } from "../../hooks/useProfile";

import { db } from "../../db";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";

import { Tab, Tabs } from "react-bootstrap";
import UserCard from "../../components/UserCard";

function GlobalStats({games_played, games_won, percentage_of_playing_white}) {
  return <>
    <p>Games played: {games_played}</p>
    <p>Games won: {games_won}</p>
    <p>Percentage of games played as white: {percentage_of_playing_white}</p>
  </>
}

export default function Stats() {

  const [gamemode, setGamemode] = useState("BOT")

  const { data: netstats, error: neterror } = useSWR("https://apichessapp.server.ultras-playroom.xyz/user/stats/", fetcher)

  const globalQuery = useLiveQuery(async () => {
    const amountOfGames = await db.table("games").count();

    const amountOfGamesWon = await db.table("games").filter(function (game) {
      return game.colourPlaying === game.gameWon
    }).count();

    const amountOfGamesWhite = await db.table("games").where({
      colourPlaying: "WHITE"
    }).count();

    return {
      amountOfGames,
      amountOfGamesWhite,
      amountOfGamesWon
    }
  })

  const localQuery = useLiveQuery(async () => {
    if ((typeof gamemode === "undefined") || (gamemode === "NET")) { return [] }

    const games = db.table("games").where({
      gameType: gamemode
    });

    const amountOfGames = await games.count();

    const amountOfGamesWhite = await db.table("games").where({
      gameType: gamemode,
      colourPlaying: "WHITE"
    }).count();

    const amountOfGamesWon = await games.filter(function (game) {
      return game.colourPlaying === game.gameWon
    }).count();

    console.log(gamemode, {amountOfGames, amountOfGamesWhite})

    return {
      games_played: amountOfGames,
      games_won: amountOfGamesWon,
      percentage_of_starting_white: ((amountOfGamesWhite / Math.max(amountOfGames, 1)) * 100)
    }
  }, [gamemode]);

  return (
    <Main title="Stats">
      <h2>Stats</h2>
      <h3>Global stats</h3>
      {(globalQuery && netstats)
      ? <GlobalStats
          games_played={globalQuery.amountOfGames + netstats.games_played + ' (' + netstats.games_played + ' online)'}
          games_won={globalQuery.amountOfGamesWon + netstats.games_won + ' (' + netstats.games_won + ' online)'}
          percentage_of_playing_white={((globalQuery.amountOfGamesWhite / Math.max(globalQuery.amountOfGames, 1)) * 100).toFixed(2) + '% offline, ' + (netstats.percentage_of_playing_white || 0).toFixed(2) + '% online'}
        />
      : ((globalQuery && neterror)
          ? <>
              <b>Online game stats are not available.</b>
              <GlobalStats
                games_played={globalQuery.amountOfGames}
                games_won={globalQuery.gamesWon}
                percentage_of_playing_white={((globalQuery.amountOfGamesWhite / Math.max(globalQuery.amountOfGames, 1)) * 100).toFixed(2) + '% offline'}
              />
            </>
          : <b>Loading</b>
      )}
      <h3>Category stats</h3>
      <Tabs
        id="controlled-tab-example"
        activeKey={gamemode}
        onSelect={(k) => setGamemode(k)}
        className="mb-3"
      >
        <Tab eventKey="BOT" title="Bot">
          {localQuery && (gamemode != "NET")
            ? <>
              <p>Games played: {localQuery.games_played}</p>
              <p>Games won: {localQuery.games_won} ({((localQuery.games_won / Math.max(localQuery.games_played, 1)) * 100).toFixed(2)}%)</p>
              <p>Percentage of games played as white: {(localQuery.percentage_of_starting_white || 0).toFixed(2)}%</p>
            </>
            : <b>Loading</b>
          }
        </Tab>
        <Tab eventKey="LOCAL" title="Local">
          {localQuery && (gamemode != "NET")
            ? <>
              <p>Games played: {localQuery.games_played}</p>
              <p>Games won: {localQuery.games_won} ({((localQuery.games_won / Math.max(localQuery.games_played, 1)) * 100).toFixed(2)}%)</p>
              <p>Percentage of games played as white: {(localQuery.percentage_of_starting_white || 0).toFixed(2)}%</p>
            </>
            : <b>Loading</b>
          }
        </Tab>
        <Tab eventKey="NET" title="Online">
          {netstats && (gamemode === "NET")
            ? <>
              <p>Games played: {netstats.games_played}</p>
              <p>Games won: {netstats.games_won} ({((netstats.games_won / Math.max(netstats.games_played, 1)) * 100).toFixed(2)}%)</p>
              <p>Percentage of games played as white: {(netstats.percentage_of_playing_white || 0).toFixed(2)}%</p>
              <p className={"mb-0"}>Favourite opponent:</p> {
                netstats.favourite_opponent
                  ? <UserCard
                    username={netstats.favourite_opponent.name || "Anonymous"}
                    avatarhash={netstats.favourite_opponent.avatar_hash}
                    rank={netstats.favourite_opponent.rank}
                  />
                  : <b>No opponents?</b>
                }
            </>
            : (neterror
              ? <>
                <p>Online game stats are not available.</p>
              </>
              : <b>Loading</b>
            )
          }
        </Tab>
      </Tabs>
    </Main>
  );
}