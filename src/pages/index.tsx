import { useRouter } from "next/router";
import { BannerText, H2 } from "../components/typography";
import { Button } from "../components/button";
import { Modal } from "@/components/modal";
import { Input } from "@/components/input";
import { FormEvent } from "react";

export default function Home() {
  const router = useRouter();
  const isModalOpen = !!router.query.modal;
  async function createLobby() {
    const response = await fetch("api/createLobby", {
      method: "POST",
    });
    if (response.ok) {
      const { gameCode } = await response.json();
      router.push(`/game/${gameCode}/?createPlayerModal=true`);
    }
  }

  async function handleJoinLobby(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const gameCode = String(formData.get("game-code"));

    if (!gameCode) {
      // TODO: need to show error
    } else {
      const response = await fetch("/api/enterLobby", {
        method: "POST",
        body: JSON.stringify(gameCode),
      });
      if (response.ok) {
        router.push(`/game/${gameCode}/?createPlayerModal=true`);
      }
    }
  }

  return (
    <main className="flex h-full flex-col items-center justify-center gap-8">
      <BannerText>Sparkle</BannerText>
      <H2>The family-friendly dice game.</H2>
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        <Button type="button" onClick={() => router.push("/?modal=true")}>
          Join a lobby
        </Button>
        <Button type="button" onClick={createLobby}>
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
          />
          <Button type="submit">Join a lobby</Button>
        </form>
      </Modal>
    </main>
  );
}
