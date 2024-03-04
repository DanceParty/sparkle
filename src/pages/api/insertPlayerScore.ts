import { insertPlayer } from "@/data/player";
import { insertScore } from "@/data/score";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = JSON.parse(req.body);
  try {
    const [newPlayer] = await insertPlayer(data);
    await insertScore({
      gameId: newPlayer.gameId,
      playerId: newPlayer.id,
    });
    res.status(200).json({ newPlayer });
  } catch (e) {
    res.status(500).json({ message: "Inserting a player was not successful." });
  }
}
