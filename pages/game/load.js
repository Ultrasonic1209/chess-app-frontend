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

export default function Preferences() {
    const router = useRouter();

    const isOnline = useOnlineStatus();

    const addToast = useToastContext()

    const [gamemode, setGamemode] = useState();

    const gamemodeOnClick = (ev) => setGamemode(ev.target.dataset.gamemode);

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

    const remotePage = useState(0)

    const params = new URLSearchParams({
      page: remotePage,
      page_size: 48,
      my_games: false,
    });

    const { remotegames, remoteerror } = useSWR(gamemode === "NET" ? "https://apichessapp.server.ultras-playroom.xyz/chess/get-games" + params.toString(): null, fetcher)
    
    useEffect(() => {
      console.log("refreshing (remote)!");
      if (remoteerror) {
        addToast({
          "title": "Checkmate",
          "message": "An error occured whilst retrieving remote games."
        });
      } else if (remotegames) {
        console.log(remotegames);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [remotegames, remoteerror])


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
                    remotegames?.map(game => (
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