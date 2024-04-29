import Core from "@landbot/core";
import {useEffect, useState, useRef} from "react";

export default function Core () {

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
}