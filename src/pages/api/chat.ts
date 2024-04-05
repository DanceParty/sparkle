import { NextApiRequest } from "next";
import { IMessage } from "@/types/chat";
import { NextApiResponseServerIO } from "./socket/io";

export default function chatHandler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method === "POST") {
    const message = JSON.parse(req.body) as IMessage;

    res.socket.server.io.emit("message", message);

    res.status(201).json(message);
  }
}
