import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "./socket/io";

export default function chatHandler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method === "POST") {
    const message = JSON.parse(req.body);

    res.socket.server.io.emit("message", message);

    res.status(201).json(message);
  }
}
