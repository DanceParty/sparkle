import { H1, Span } from "@/app/components/typography";

export default function GamePage({ params }: { params: { id: string } }) {
  return (
    <main className="flex h-full flex-row-reverse">
      <aside className="sticky flex h-full flex-col justify-between border border-black p-4">
        <div>
          <ul>
            <li className="border border-black px-4 py-4">Player 1</li>
            <li className="border border-black px-4 py-4">Player 2</li>
            <li className="border border-black px-4 py-4">Player 3</li>
            <li className="border border-black px-4 py-4">Player 4</li>
          </ul>
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
    </main>
  );
}
