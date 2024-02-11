import { redirect } from "next/navigation";
import { BannerText, H2 } from "./components/typography";
import { Button } from "./components/button";
import { NewGame, checkDuplicatedGame, getGame, insertGame } from "./data/game";
import { makeGameCode } from "./util/gameHelper";
import { Modal } from "./components/modal";
import { Input } from "./components/input";

type HomeProps = {
  searchParams: Record<string, string> | null | undefined;
};

export default function Home({ searchParams }: HomeProps) {
  const isModalOpen = !!searchParams?.modal;

  async function handleGameForm(formData: FormData) {
    "use server";
    const intent = String(formData.get("intent"));
    const code = String(formData.get("game-code"));

    if (intent === "join-lobby-one") {
      // open modal to enter game code
      redirect("/?modal=true");
    } else if (intent === "join-lobby-two") {
      // Validate the lobby exists and status === "setting up"
      if (!code) throw Error("Code is missing.");

      try {
        const game = await getGame(code);
        if (game.length > 1) {
          throw Error("this is conflict game code.");
        } else if (game.length === 0) {
          throw Error("no game exist with the game code.");
        }
      } catch (e) {
        throw Error("joining Game was not successful.");
      } finally {
        redirect(`/game/${code}`);
      }
    } else if (intent === "create-lobby") {
      // generate game code and validate status === "in progress" or "setting up" with same code
      let isGameCodeUnique = false;
      let gameCode = "";
      while (!isGameCodeUnique) {
        gameCode = makeGameCode(5);
        const [result] = await checkDuplicatedGame(gameCode);
        if (result.gameCodeCount === 0) {
          isGameCodeUnique = true;
        }
      }

      try {
        const newGame: NewGame = { code: gameCode, status: "setting up" };
        await insertGame(newGame);
      } catch (e) {
        throw Error("Creating Game was not successful.");
      } finally {
        redirect(`/game/${gameCode}`);
      }
    }
  }

  return (
    <main className="flex h-full flex-col items-center justify-center gap-8">
      <BannerText>Sparkle</BannerText>
      <H2>The family-friendly dice game.</H2>
      <form
        action={handleGameForm}
        className="mt-6 flex flex-col items-center gap-6 md:mt-12"
      >
        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          <Button type="submit" name="intent" value="join-lobby-one">
            Join a lobby
          </Button>
          <Button type="submit" name="intent" value="create-lobby">
            Create a lobby
          </Button>
        </div>
        <Modal isOpen={isModalOpen} contentClass="flex flex-col gap-4">
          <Input
            type="text"
            name="game-code"
            placeholder="Enter a lobby code..."
          />
          <Button type="submit" name="intent" value="join-lobby-two">
            Join a lobby
          </Button>
        </Modal>
      </form>
    </main>
  );
}
