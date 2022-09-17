import Main from "../../components/Main";

import { useEffect, useState } from "react";
import { Table, Container, ListGroup, Button } from "react-bootstrap";

import { useRouter } from 'next/router'

import { useOnlineStatus } from "../../contexts/OnlineStatus";

import { db } from "../../db";
import { useLiveQuery } from "dexie-react-hooks";
import useSWR from "swr";
import { useToastContext } from "../../contexts/ToastContext";

const fetcher = url => fetch(url, {withCredentials: true, credentials: 'include'}).then(r => r.json())

function getOpponent ({players, is_white}) {
  if ((typeof players === "undefined") || (is_white === null)) { return null }
  players.forEach(player => {
    if (player.isWhite != is_white) {
      return player
    }
  });
}

export default function Preferences() {
    const router = useRouter();

    const isOnline = useOnlineStatus();

    const addToast = useToastContext()

    const [gamemode, setGamemode] = useState();
    const [presence, setPresence] = useState("1");

    const gamemodeOnClick = (ev) => setGamemode(ev.target.dataset.gamemode);
    const presenceOnClick = (ev) => setPresence(ev.target.dataset.presence);

    const games = useLiveQuery(async () => {
        console.log("refreshing!");
        if (gamemode === undefined) { return [] }
        const gamearray = await db.table("games")
          .where("gameType")
          .equals(gamemode)
          .toArray();
        console.log(gamearray);
        return gamearray;
      },
    [gamemode]);

    // eslint-disable-next-line no-unused-vars
    const [ remotePage, setRemotePageNumber ] = useState(0)

    const params = new URLSearchParams({
      page: remotePage,
      page_size: 48,
      my_games: presence === "1",
    });

    const { data, error } = useSWR(gamemode === "NET" ? "https://apichessapp.server.ultras-playroom.xyz/chess/get-games/?" + params.toString(): null, fetcher)
    
    useEffect(() => {
      console.log("refreshing (remote)!");
      if (error) {
        addToast({
          "title": "Checkmate",
          "message": "An error occured whilst retrieving remote games."
        });
      } else if (data) {
        console.log(data);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, error])


    const onClick = (ev) => {
      const { id, type } = ev.target.dataset;
      router.push("/game/" + type.toLowerCase() + "/" + id);
    }

    return (
      <Main title="Load Game">
        <h2>Load Game</h2>
        <Container id="selectGamemode" className="p-0 pt-3">
          <h5>Select gamemode</h5>
          <ListGroup horizontal="sm">
            <ListGroup.Item active={gamemode === "BOT"} onClick={gamemodeOnClick} data-gamemode="BOT" type="button" action>Vs. Bot</ListGroup.Item>
            <ListGroup.Item active={gamemode === "LOCAL"} onClick={gamemodeOnClick} data-gamemode="LOCAL" type="button" action>Vs. Player</ListGroup.Item>
            <ListGroup.Item active={gamemode === "NET"} onClick={gamemodeOnClick} data-gamemode="NET" type="button" action disabled={!isOnline}>Vs. Online Player</ListGroup.Item>
          </ListGroup>
        </Container>
        {gamemode === "NET"
        ? <Container id="selectOwner" className="p-0 pt-3">
            <h5>Select presence</h5>
            <ListGroup horizontal="sm">
              <ListGroup.Item active={presence === "1"} onClick={presenceOnClick} data-presence={"1"} type="button" action>Games I&rsquo;m in</ListGroup.Item>
              <ListGroup.Item active={presence === "0"} onClick={presenceOnClick} data-presence={"0"} type="button" action>All games</ListGroup.Item>
            </ListGroup>
          </Container>
        : undefined}
        {gamemode
          ? (
            <Table bordered hover className="p-0 mt-3">
              <thead>
                <tr>
                  <th>Game #</th>
                  {
                    (gamemode === "BOT") || (gamemode === "NET")
                    ? (<th>Vs.</th>)
                    : (undefined)
                  }
                  <th>Winner</th>
                  <th>-</th>
                </tr>
              </thead>
              <tbody>
                {
                  (gamemode === "NET")
                  ? (
                    data?.map(game => (
                    <tr key={game.game_id}>
                      <td>{game.game_id}</td>
                      <td>{(typeof game.is_white === "undefined") ? 'N/A' : (getOpponent(game)?.username || "Anonymous")}</td>
                      <td>
                        {game.time_ended
                          ? ((game.white_won === true)
                            ? "White"
                            : ((game.white_won === false)
                              ? "Black"
                              : "Draw"
                            )
                          )
                          : "None yet"
                        }
                      </td>
                      <td>
                        <Button variant="primary" data-id={game.game_id} data-type={"NET"} onClick={onClick}>Enter Game</Button>
                      </td>
                    </tr>
                    )))
                  : (
                    games?.map(game => (
                    <tr key={game.id}>
                      <td>{game.id}</td>
                      {
                        (gamemode === "BOT") || (gamemode === "NET")
                        ? (<td>
                          {gamemode === "BOT"
                          ? "Bot (" + game.difficulty + ")"
                          : (undefined)
                          }
                        </td>)
                        : (undefined)
                      }
                      <td>
                        {game.gameWon ? game.gameWon : "None yet"}
                      </td>
                      <td>
                        <Button variant="primary" data-id={game.id} data-type={game.gameType} onClick={onClick}>Enter Game</Button>
                      </td>
                    </tr>
                )))}
              </tbody>
            </Table>
            )
          : (undefined)
        }
      </Main>
    );
}