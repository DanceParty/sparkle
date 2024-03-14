import { getGame } from "@/data/game";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = JSON.parse(req.body);

  try {
    const game = await getGame(data);

    if (game.length > 1) {
      throw Error("This is conflict game code.");
    } else if (game.length === 0) {
      throw Error("No game exist with the game code.");
    }
    res.status(200).json({ game });
  } catch (e) {
    res.status(500).json({ message: "Joining Game was not successful." });
  }
}
