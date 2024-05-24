import { useContext, useEffect, useState } from "react";
import { SocketContext } from "./provider/SocketProvider";
import { IMessage } from "@/types/chat";
import { Input } from "./input";
import { Button } from "./button";

type ChatProps = {
  playerName: string | undefined;
};

export function Chat({ playerName }: ChatProps) {
  const { socket, status } = useContext(SocketContext);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");

  const sendMessage = async () => {
    if (currentMessage && playerName) {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ content: currentMessage, username: playerName }),
      });

      if (res.ok) {
        setCurrentMessage("");
      }
    }
  };

  useEffect(() => {
    socket?.on("message", (message: IMessage) => {
      setMessages((prev) => [...prev, message]);
    });
  }, [socket]);

  return (
    <div>
      {status ? <span>connected</span> : <span>disconnected</span>}
      {messages.map((message, index) => (
        <p key={index}>{`username ) ${message.content}`}</p>
      ))}
      <Input
        className="w-full border border-black px-4 py-1"
        type="text"
        placeholder="enter a message..."
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />
      <Button onClick={sendMessage}>Send</Button>
    </div>
  );
}
