import { BannerText, H2 } from "./components/typography";
import { HomeButtonGroup } from "./components/home-button-group";
import { Button } from "./components/button";
import { Input } from "./components/input";

export default function Home() {
  return (
    <main className="flex flex-col h-full justify-center items-center gap-8">
      <BannerText>Sparkle</BannerText>
      <H2>The family-friendly dice game.</H2>
      <form
        method="POST"
        className="flex flex-col items-center mt-6 md:mt-12 gap-6"
      >
        <Input type="text" placeholder="Enter a lobby code..." />
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <Button>Join a lobby</Button>
          <Button>Create a lobby</Button>
        </div>
      </form>
    </main>
  );
}
