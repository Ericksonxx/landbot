import { useCallback } from "react";
import './dialog.css'

export default function Dialog({message, core}) {

    const sendButton = useCallback((buttonValue, payload) => {
        if (buttonValue !== "" && core.current) {
          core.current.sendMessage({ type: 'button', message: buttonValue, payload: payload });
        }
      }, []);

      return(
        <div className="dialog">
          <p>{message.text}</p>
          {(message.buttons).map((button, i) =>{
            return(
              <button key={i} onClick={() => sendButton(button, message.payloads[i], i)}>{button}</button>
            )
          })}
          <p className="helper">Press a button to select</p>
        </div>
      )
}