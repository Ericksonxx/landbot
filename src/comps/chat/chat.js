import { useState, useEffect, useRef, useCallback } from "react";
import Core from "@landbot/core";
import './chat.css'

//comps
import Text from '../text/text'
import Dialog from '../dialog/dialog'
import FileUpload from '../fileUpload/fileUpload'
import InputField from '../inputField/inputField'

export default function Chat() {
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState("");
  const [config, setConfig] = useState(null);
  
  const core = useRef(null);

  useEffect(() => {
    fetch("https://landbot.online/v3/H-2204459-EB6PNLZ0FX9RMYFU/index.json")
      .then((res) => res.json())
      .then(setConfig);
  }, []);

  useEffect(() => {
    if (config) {
      core.current = new Core(config);
      core.current.pipelines.$readableSequence.subscribe((data) => {
        setMessages(
          (messages) =>
            ({
              ...messages,
              [data.key]: parseMessage(data),
            })
        );
      });

      core.current.init().then((data) => {
        setMessages(parseMessages(data.messages));
      });
    }
  }, [config]);

  useEffect(() => {
    const container = document.getElementById("landbot-messages-container");
    scrollBottom(container);
  }, [messages]);


  console.log(messages)

  return (
    <section id="landbot-app">
      <div className="chat-container">
        <div className="landbot-chat">
          <div
            className="landbot-messages-container"
            id="landbot-messages-container"
          >
            {Object.values(messages)
              .filter(messagesFilter)
              .sort((a, b) => a.timestamp - b.timestamp)
              .map((message) => (
                <article
                  className={message.author}
                  data-author={message.author}
                  key={message.key}
                >
                  <div className="media-content landbot-message-content">
                  {message.type === "text" && 
                    <Text message={message} core={core} />
                  }
                  {message.type === "dialog" && 
                  <Dialog message={message} core={core} />
                  }
                  {message.textarea?.type === 'file' && 
                    <FileUpload core={core} />
                  }
                  </div>
                </article>
              ))}
          </div>
          <InputField core={core} />
        </div>
      </div>
    </section>
  );
};

function parseMessage(data) {
  return {
    key: data.key,
    text: data.title || data.message,
    author: data.samurai !== undefined ? "bot" : "user",
    timestamp: data.timestamp,
    type: data.type,
    extra: data.extra,
    buttons: data.buttons,
    url: data.url,
    payloads: data.payloads,
    textarea: data.extra.textarea,
  };
}


function parseMessages(messages) {
  return Object.values(messages).reduce((obj, next) => {
    obj[next.key] = parseMessage(next);
    return obj;
  }, {});
}

function messagesFilter(data) {
  /** Support for basic message types */
  return ["text", "dialog"].includes(data.type);
}

function scrollBottom(container) {
  if (container) {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }
}



