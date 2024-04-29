
import { useState, useCallback } from "react";
import './inputField.css'

export default function InputField({ message, core }) {

    const [input, setInput] = useState("");

    const submit = useCallback(() => {
        if (input !== "" && core.current) {
          core.current.sendMessage({ message: input });
          setInput("");
        }
      }, [input]);

    return(
        <div className="landbot-input-container">
        <div className="field">
          <div className="control">
            <input
              className="landbot-input"
              onChange={(e) => setInput(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="Type here..."
              type="text"
              value={input}
            />
            <button
              className="button landbot-input-send"
              disabled={input === ""}
              onClick={() => submit()}
              type="button"
            >
              SEND
            </button>
          </div>
        </div>
      </div>
    )
}