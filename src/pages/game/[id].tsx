import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Modal } from "@/components/modal";
import { H1, Span } from "@/components/typography";
import { getGame, getPlayersForGame } from "@/data/game";
import { NewPlayer } from "@/data/player";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { FormEvent } from "react";

type GameProps = {
  players: {
    player: {
      role: "OWNER" | "PLAYER";
      id: string;
      username: string;
      turnOrderIndex: number;
      gameId: string;
    };
    game: {
      code: string;
      status: "in progress" | "setting up" | "finished";
      id: string;
    };
  }[];
  game: {
    code: string;
    status: "in progress" | "setting up" | "finished";
    id: string;
  };
};
export default function GamePage({
  players,
  game,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const isCreatePlayerModalOpen = !!router.query.createPlayerModal;
  const gameId = game?.id;
  async function handleCreatePlayer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const playerName = String(formData.get("player-name"));

    let newPlayer: NewPlayer = {};
    if (players && playerName) {
      if (players.length === 0) {
        newPlayer = {
          username: playerName,
          turnOrderIndex: 0,
          gameId: gameId,
          role: "OWNER",
        };
      } else {
        newPlayer = {
          username: playerName,
          turnOrderIndex: players.length,
          gameId: gameId,
          role: "PLAYER",
        };
      }
    }

    const response = await fetch("/api/insertPlayerScore", {
      method: "POST",
      body: JSON.stringify(newPlayer),
    });
    if (response.ok) {
      router.push(`/game/${game?.code}`);
    }
  }
  return (
    <main className="flex h-full flex-row-reverse">
      <aside className="sticky flex h-full flex-col justify-between border border-black p-4">
        <div>
          {players?.length === 0 ? (
            <span>No player in this game yet</span>
          ) : (
            <ul>
              {players?.map((playerInfo) => (
                <li
                  className="border border-black px-4 py-4"
                  key={playerInfo.player.id}
                >
                  {playerInfo.player.username}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <p>Player 1) This is a message.</p>
            <p>Player 2) This is another message.</p>
            <p>Player 4) I am gonna win this game!</p>
          </div>
          <input
            className="w-full border border-black px-4 py-1"
            type="text"
            placeholder="enter a message..."
          />
        </div>
      </aside>
      <div className="flex w-full flex-col items-center justify-between py-12">
        <H1>Player 1&apos;s turn!</H1>

        <div className="flex flex-col gap-12">
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4">
              <div className="flex h-24 w-24 items-center justify-center border border-black">
                dice 1
              </div>
              <div className="flex h-24 w-24 items-center justify-center border border-black">
                dice 2
              </div>
              <div className="flex h-24 w-24 items-center justify-center border border-black">
                dice 3
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-24 w-24 items-center justify-center border border-black">
                dice 4
              </div>
            </div>
          </div>
          <button className="rounded-md border border-black px-4 py-8 hover:bg-black hover:text-white">
            Roll Dice / Save Dice / Confirm...
          </button>
        </div>
        <div className="flex flex-col items-center gap-8">
          <Span className="text-2xl">Total Score: 500 🎉</Span>
          <div className="flex gap-4">
            <div className="flex h-24 w-24 items-center justify-center border border-black">
              dice 5
            </div>
            <div className="flex h-24 w-24 items-center justify-center border border-black">
              dice 6
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isCreatePlayerModalOpen}
        redirectRoute={`/game/${game?.code}`}
      >
        <form onSubmit={handleCreatePlayer} className="flex flex-col gap-4">
          <Input
            type="text"
            name="player-name"
            placeholder="Enter a player name..."
          />
          <Button type="submit">Create a Player</Button>
        </form>
      </Modal>
    </main>
  );
}

export const getServerSideProps = (async ({ params }) => {
  if (params && typeof params.id === "string") {
    const [game] = await getGame(params.id);
    const joinedPlayers = await getPlayersForGame(game.id);
    return { props: { players: joinedPlayers, game } };
  }
  return { props: {} };
}) satisfies GetServerSideProps<{ players: GameProps } | {}>;
