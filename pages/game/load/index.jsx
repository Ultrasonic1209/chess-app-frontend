import Main from "../../../components/Main";

import { useEffect } from "react";
import { Table, Container, ListGroup, Button } from "react-bootstrap";
import Link from "next/link";

import { useOnlineStatus } from "../../../contexts/OnlineStatus";

import { db } from "../../../db";
import { useLiveQuery } from "dexie-react-hooks";
import useSWR from "swr";
import { useToastContext } from "../../../contexts/ToastContext";
import { useRouter } from "next/router";

import { fetcher } from "../../../hooks/useProfile"
import { Paginator } from "./Paginator";

function getOpponent(players, is_white) {
  if ((typeof players === "undefined") || (typeof is_white === "undefined")) { return {} }

  let found_player = {}

  players.forEach(player => {
    if (player.is_white != is_white) {
      found_player = player
    }
  });

  return found_player
}

function formatPlayer(player) {
  if (typeof player.is_white === "undefined") { return "None yet" }
  const colour = player.is_white ? "White" : "Black"
  return (player?.username || "Anonymous") + " (" + colour + ")";
}

export default function LoadGame() {
  const isOnline = useOnlineStatus();

  const addToast = useToastContext()

  const router = useRouter();

  const { gamemode, presence, page } = router.query;

  useEffect(() => {
    if (gamemode === "NET") {
      if (typeof presence === "undefined") {
        router.replace({
          query: { ...router.query, presence: "1" },
        });
      }

      if (typeof page === "undefined") {
        router.replace({
          query: { ...router.query, page: "1" },
        });
      }
    }
  }, [router, presence, gamemode, page]);

  //const [gamemode, setGamemode] = useState();
  //const [presence, setPresence] = useState("1");

  const gamemodeOnClick = (ev) => router.replace({
    query: { ...router.query, gamemode: ev.target.dataset.gamemode },
  });
  const presenceOnClick = (ev) => router.replace({
    query: { ...router.query, presence: ev.target.dataset.presence },
  });
  const pageOnClick = (ev) => router.replace({
    query: { ...router.query, page: ev.target.dataset.page },
  });

  const games = useLiveQuery(async () => {
    console.log("refreshing!");
    if ((typeof gamemode === "undefined") || (gamemode === "NET")) { return [] }
    const gamearray = await db.table("games")
      .where("gameType")
      .equals(gamemode)
      .toArray();
    console.log(gamearray);
    return gamearray;
  },
    [gamemode]);

  const params = new URLSearchParams({
    page: parseInt(page || 1) - 1,
    page_size: 25,
    my_games: presence === "1",
  });

  const { data, error, isValidating } = useSWR(gamemode === "NET" ? "https://apichessapp.server.ultras-playroom.xyz/chess/get-games/?" + params.toString() : null, fetcher, { fallbackData: [] })

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

  const amountOfGames = (gamemode === "NET") ? data?.length || 0 : games?.length || 0

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
        : undefined
      }
      {
        ((gamemode === "NET") && ((amountOfGames > 0) || (page > 1)))
          ? (
            <Paginator
              page={page}
              setPage={pageOnClick}
            />
          ) : undefined
      }
      {(gamemode) && (amountOfGames > 0)
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
                        <td>{(game.is_white === null) ? 'N/A' : formatPlayer(getOpponent(game?.players, game?.is_white))}</td>
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
                          <Button
                            variant="primary"
                            href={"/game/net/" + game.game_id}
                            as={Link}
                          >Enter Game</Button>
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
                          <Button
                            variant="primary"
                            href={"/game/" + game.gameType.toLowerCase() + "/" + game.id}
                            as={Link}
                          >Enter Game</Button>
                        </td>
                      </tr>
                    )))}
            </tbody>
          </Table>
        )
        : (undefined)
      }
      {
        ((gamemode) && (amountOfGames < 1))
          ? (((gamemode === "NET") && isValidating)
            ? <div className={"mt-5 text-center"}>
              <strong>Loading...</strong>
            </div>
            : <div className={"mt-5 text-center"}>
              <strong>No games?</strong>
              <br />
              <Button
                className={"mt-2"}
                variant="primary"
                as={Link}
                href="/game/new"
              >New Game</Button>
              {
                ((gamemode === "NET") && ((parseInt(page) || 1) > 1))
                  ? (
                    <>
                      <br />
                      <Button
                        className={"mt-2"}
                        variant="secondary"
                        onClick={pageOnClick}
                        data-page={(parseInt(page) || 2) - 1}
                      >Previous Page</Button>
                    </>
                  )
                  : undefined
              }
            </div>
          )
          : undefined
      }
      {
        ((gamemode === "NET") && ((amountOfGames > 0) || (page > 1)))
          ? (
            <Paginator
              page={page}
              setPage={pageOnClick}
            />
          ) : undefined
      }
    </Main>
  );
}