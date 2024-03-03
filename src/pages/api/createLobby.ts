import type { NextApiRequest, NextApiResponse } from "next";
import { NewGame, checkDuplicatedGame, insertGame } from "../../data/game";
import { makeGameCode } from "../../util/gameHelper";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let isGameCodeUnique = false;
  let gameCode = "";
  while (!isGameCodeUnique) {
    gameCode = makeGameCode(5);
    const [{ gameCodeCount }] = await checkDuplicatedGame(gameCode);
    if (gameCodeCount === 0) {
      isGameCodeUnique = true;
    }
  }

  try {
    const newGame: NewGame = { code: gameCode, status: "setting up" };
    await insertGame(newGame);
    res.status(200).json({ gameCode });
  } catch (e) {
    res.status(500).json({ message: "Creating Game was not successful." });
  }
}
