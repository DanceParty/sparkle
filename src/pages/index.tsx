import { useRouter } from "next/router";
import { BannerText, H2 } from "../components/typography";
import { Button } from "../components/button";
type HomeProps = {
  searchParams: Record<string, string> | null | undefined;
};
export default function Home({ searchParams }: HomeProps) {
  const router = useRouter();

  async function createLobby() {
    const response = await fetch("api/createLobby", {
      method: "POST",
    });
    if (response.ok) {
      const { gameCode } = await response.json();
      router.push(`/game/${gameCode}/?createPlayerModal=true`);
    }
  }

  return (
    <main className="flex h-full flex-col items-center justify-center gap-8">
      <BannerText>Sparkle</BannerText>
      <H2>The family-friendly dice game.</H2>
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        <Button type="button">Join a lobby</Button>
        <Button type="button" onClick={createLobby}>
          Create a lobby
        </Button>
      </div>
      {/* <Modal
              isOpen={isModalOpen}
              contentClass="flex flex-col gap-4"
              redirectRoute="/"
            >
              <Input
                type="text"
                name="game-code"
                placeholder="Enter a lobby code..."
              />
              <Button type="submit" name="intent" value="join-lobby-two">
                Join a lobby
              </Button>
            </Modal> */}
    </main>
  );
}
