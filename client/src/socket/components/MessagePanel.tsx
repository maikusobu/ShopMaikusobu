import React, { useState } from "react";
import StatusIcon from "./StatusIcon";
import type { UserType } from "./Chat";
interface MessagePanelProps {
  user: UserType;
  onInput: (input: string) => void;
  className: string;
}

const MessagePanel: React.FC<MessagePanelProps> = ({
  user,
  onInput,
  className,
}) => {
  const [input, setInput] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValid) {
      onInput(input);
      setInput("");
    }
  };

  const displaySender = (index: number) => {
    return (
      index === 0 ||
      user.conversations[0].messages[index - 1].fromSelf !==
        user.conversations[0].messages[index].fromSelf
    );
  };

  const isValid = input.length > 0;

  return (
    <div className={className}>
      <div className="header">
        <StatusIcon connected={user.connected} />
        {user.username}
      </div>

      <ul className="messages">
        {user.conversations[0].messages.map((message, index) => (
          <li key={index} className="message">
            {displaySender(index) && (
              <div className="sender">
                {message.fromSelf ? "(yourself)" : user.username}
              </div>
            )}
            {message.content}
          </li>
        ))}
      </ul>

      <form onSubmit={onSubmit} className="form">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Your message..."
          className="input"
        />
        <button disabled={!isValid} className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default MessagePanel;
