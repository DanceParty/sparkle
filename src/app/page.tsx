import { redirect } from "next/navigation";
import { BannerText, H2 } from "./components/typography";
import { Input } from "./components/input";
import { Button } from "./components/button";
import { NewGame, checkDuplicatedGame, insertGame } from "@/lib/drizzle";
import { makeGameCode } from "./util/gameHelper";
import { game } from "@/lib/schema";

export default function Home() {
  async function handleGameForm(formData: FormData) {
    "use server";
    const intent = String(formData.get("intent"));

    if (intent === "join-lobby") {
      // TODO: Validate the lobby exists and status === "setting up"
      //       Cancel and return errors for UI if not valid
      // redirect(`/game/${code}`);
    } else if (intent === "create-lobby") {
      // TODO: Create the lobby
      //       Cancel and return errors for UI if not valid

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
          <Button type="submit" name="intent" value="join-lobby">
            Join a lobby
          </Button>
          <Button type="submit" name="intent" value="create-lobby">
            Create a lobby
          </Button>
        </div>
      </form>
    </main>
  );
}
