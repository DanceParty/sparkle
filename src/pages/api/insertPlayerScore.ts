import { getPlayersForGame, insertPlayer } from "@/data/player";
import { insertScore } from "@/data/score";
import type { NextApiRequest, NextApiResponse } from "next";
import { encrypt, expires } from "@/lib/session";
import { setCookie } from "cookies-next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let data = JSON.parse(req.body);
  try {
    const joinedPlayers = await getPlayersForGame(data.gameId);
    if (joinedPlayers.length === 0) {
      data = { ...data, role: "OWNER", turnOrderIndex: 0 };
    } else {
      data = { ...data, role: "PLAYER", turnOrderIndex: joinedPlayers.length };
    }

    const [newPlayer] = await insertPlayer(data);
    await insertScore({
      gameId: newPlayer.gameId,
      playerId: newPlayer.id,
    });

    const session = await encrypt(newPlayer);
    setCookie("session", session, {
      req,
      res,
      httpOnly: true,
      maxAge: expires,
      sameSite: "lax",
      path: "/",
    });

    res.status(200).json({ newPlayer });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Inserting a player was not successful." });
  }
}
