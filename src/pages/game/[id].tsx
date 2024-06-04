import { Chat } from "@/components/chat";
import { SocketProvider } from "@/components/provider/SocketProvider";
import { H1, Span } from "@/components/typography";
import { getPlayersForGame } from "@/data/game";
import { NewPlayer } from "@/data/player";

import { getSession } from "@/lib/session";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
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
  me,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className="flex h-full flex-row-reverse">
      <SocketProvider>
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
            <Chat playerName={me?.username} />
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
      </SocketProvider>
    </main>
  );
}

export const getServerSideProps = (async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx);

  if (session) {
    const joinedPlayers = await getPlayersForGame(session.gameId);
    return {
      props: {
        players: joinedPlayers,
        me: {
          id: session.id,
          username: session.username,
          role: session.role,
          turnOrderIndex: session.turnOrderIndex,
          gameId: session.gameId,
        },
      },
    };
  } else {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}) satisfies GetServerSideProps<{ players: GameProps; me: NewPlayer } | {}>;
