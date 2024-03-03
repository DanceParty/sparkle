import { Button } from "@/oldapp/components/button";
import { Input } from "@/oldapp/components/input";
import { Modal } from "@/oldapp/components/modal";
import { H1, Span } from "@/oldapp/components/typography";
import { getGame, getPlayersForGame } from "@/oldapp/data/game";
import { NewPlayer, insertPlayer } from "@/oldapp/data/player";
import { insertScore } from "@/oldapp/data/score";
import { redirect } from "next/navigation";

type GameProps = {
  params: { id: string };
  searchParams: Record<string, string> | null | undefined;
};
export default async function GamePage({ params, searchParams }: GameProps) {
  const [game] = await getGame(params.id);
  const isCreatePlayerModalOpen = !!searchParams?.createPlayerModal;
  const joinedPlayers = await getPlayersForGame(game.id);
  async function handlePlayerForm(formData: FormData) {
    "use server";
    const playerName = String(formData.get("player-name"));
    let newPlayer: NewPlayer;
    try {
      const players = await getPlayersForGame(game.id);
      if (players.length === 0) {
        newPlayer = {
          username: playerName,
          turnOrderIndex: 0,
          gameId: game.id,
          role: "OWNER",
        };
      } else {
        newPlayer = {
          username: playerName,
          turnOrderIndex: players.length,
          gameId: game.id,
          role: "PLAYER",
        };
      }
      [newPlayer] = await insertPlayer(newPlayer);
      await insertScore({ gameId: game.id, playerId: newPlayer.id });
    } catch (e) {
      console.log(e);
    } finally {
      redirect(`/game/${game.code}`);
    }
  }

  return (
    <main className="flex h-full flex-row-reverse">
      <aside className="sticky flex h-full flex-col justify-between border border-black p-4">
        <div>
          {joinedPlayers.length === 0 ? (
            <span>No player in this game yet</span>
          ) : (
            <ul>
              {joinedPlayers.map((playerInfo) => (
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
        redirectRoute={`/game/${params.id}`}
      >
        <form action={handlePlayerForm} className="flex flex-col gap-4">
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
