import { useRouter } from "next/router";
import { BannerText, H2 } from "../components/typography";
import { Button } from "../components/button";
import { Modal } from "@/components/modal";
import { Input } from "@/components/input";
import { FormEvent, useEffect, useState } from "react";
import { NewPlayer } from "@/data/player";

enum ButtonType {
  CREATE,
  JOIN,
}
export default function Home() {
  const router = useRouter();
  const isModalOpen = !!router.query.modal;
  const [code, setCode] = useState<string>("");
  const [buttonType, setButtonType] = useState<ButtonType>();

  useEffect(() => {
    if (!!router.query.modal) {
      setCode("");
    }
  }, [router.query]);
  async function createLobby() {
    const response = await fetch("api/createLobby", {
      method: "POST",
    });

    if (!response.ok) {
      throw Error("Creating Game was not successful.");
    } else if (response.ok) {
      const { gameCode } = await response.json();
      setCode(gameCode);
    }
  }

  async function openModal(buttonType: ButtonType) {
    setButtonType(buttonType);
    if (buttonType === ButtonType.CREATE) {
      createLobby();
    }
    router.push("/?modal=true");
  }

  async function handleJoinLobby(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const gameCode = formData.get("game-code")
      ? String(formData.get("game-code"))
      : code;
    const playerName = String(formData.get("player-name"));

    if (!gameCode) throw Error("Code is missing.");
    if (!playerName) throw Error("Player name is missing.");

    const lobbyRes = await fetch("/api/enterLobby", {
      method: "POST",
      body: JSON.stringify(gameCode),
    });

    if (!lobbyRes.ok) {
      throw Error("Joining Game was not successful.");
    } else if (lobbyRes.ok) {
      lobbyRes.json().then(async ({ game }) => {
        let newPlayer: NewPlayer = {
          username: playerName,
          gameId: game[0].id,
        };

        const response = await fetch("/api/insertPlayerScore", {
          method: "POST",
          body: JSON.stringify(newPlayer),
        });

        if (!response.ok) {
          throw Error("Inserting player was not successful.");
        } else if (response.ok) {
          router.push(`/game/${gameCode}`);
        }
      });
    }
  }

  return (
    <main className="flex h-full flex-col items-center justify-center gap-8">
      <BannerText>Sparkle</BannerText>
      <H2>The family-friendly dice game.</H2>
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        <Button type="button" onClick={() => openModal(ButtonType.JOIN)}>
          Join a lobby
        </Button>
        <Button type="button" onClick={() => openModal(ButtonType.CREATE)}>
          Create a lobby
        </Button>
      </div>
      <Modal
        isOpen={isModalOpen}
        contentClass="flex flex-col gap-4"
        redirectRoute="/"
      >
        <form onSubmit={handleJoinLobby} className="flex flex-col gap-4">
          <Input
            type="text"
            name="game-code"
            placeholder="Enter a lobby code..."
            value={code}
            disabled={buttonType === ButtonType.CREATE}
            onChange={(e) => setCode(e.target.value)}
          />
          <Input
            type="text"
            name="player-name"
            placeholder="Enter a player name..."
          />
          <Button type="submit">Join a lobby</Button>
        </form>
      </Modal>
    </main>
  );
}
