import React from "react";
import { useSelector } from "react-redux";
import "./App.css";

const Message = ({ content, author, time }) => {
  const user = useSelector((state) => state.user.user);
  return (
    <div className={`${author === user && "self-msg"} ${"msg-box"}`}>
      <span className={"author"}>{author}</span>
      <p>{content}</p>
      <span className="time">{time}</span>
    </div>
  );
};

export default Message;
