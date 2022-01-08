import "./App.css";
import { useEffect, useState, useRef } from "react";
import { gql, useQuery, useSubscription, useMutation } from "@apollo/client";
import Message from "./Message";
import { addMessage, addSingleMessage, addUser } from "./Redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

const GET_MESSAGES = gql`
  query Query {
    messages {
      id
      author
      content
      createdAt
    }
  }
`;

const ADD_MESSAGE = gql`
  mutation Mutation($input: createMessageInput) {
    createMessage(input: $input)
  }
`;

const CHAT_CONNECT = gql`
  subscription Subscription {
    newChat {
      id
      author
      content
      createdAt
    }
  }
`;

function App() {
  const messages = useSelector((state) => state.user.messages);
  const user = useSelector((state) => state.user.user);
  const { loading: qloading, error, data: qdata } = useQuery(GET_MESSAGES);
  const [addMsg, { data: mutdata, loading: mutloading, error: muterror }] =
    useMutation(ADD_MESSAGE);
  const {
    data,
    error: serror,
    loading: sloading,
  } = useSubscription(CHAT_CONNECT);
  const dispatch = useDispatch();

  const messagesEndRef = useRef(null);
  const [input, setInput] = useState();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log("scrolled");
  };

  useEffect(() => {
    if (qdata) {
      console.log(qdata);
      dispatch(addMessage(qdata));
    }
  }, [qdata]);

  useEffect(() => {
    if (data) {
      dispatch(addSingleMessage(data));
      scrollToBottom();
    }
  }, [data]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!input) alert("Type something");
    addMsg({
      variables: {
        input: {
          author: user,
          content: input,
        },
      },
    });

    setInput("");
  };

  const enterHandler = (e) => {
    if (e.keyCode === 13) {
      console.log("Enter clicked");
      sendMessage();
    }
  };

  if (!user) {
    const name = prompt("Please enter your name to start chatting");
    dispatch(addUser(name));
  }

  const inputHandler = (e) => {
    setInput(e.target.value);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>GODERUN CHAT</h1>
        <button>Leave</button>
      </div>
      <div className="chat-body">
        {messages.map((message) => {
          const time = new Date(message.createdAt);
          const utc_time = time.toLocaleString();
          return (
            <Message
              content={message.content}
              time={utc_time}
              author={message.author}
              key={message.id}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-footer">
        <input
          onChange={(e) => inputHandler(e)}
          onKeyDownCapture={(e) => enterHandler(e)}
          type="text"
          value={input}
          placeholder="😀 Type your message...."
        />
        <button onClick={sendMessage}>+</button>
      </div>
    </div>
  );
}

export default App;
