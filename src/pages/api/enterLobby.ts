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
      throw Error("this is conflict game code.");
    } else if (game.length === 0) {
      throw Error("no game exist with the game code.");
    }
    console.log(data);
    res.status(200).json({ game });
  } catch (e) {
    throw Error("joining Game was not successful.");
  }
}
