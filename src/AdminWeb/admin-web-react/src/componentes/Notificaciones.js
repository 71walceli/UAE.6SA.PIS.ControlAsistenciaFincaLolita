import { Notification, Message, toaster, useToaster } from "rsuite"

export function notificar(message, options) {
    // TODO Handle passed-in parameters
    options = options ? options : {}
    toaster.push(
        <Message duration={4500} closable
            type={options.type || "info"}
            {...options} 
        >
            {message}
        </Message>
        , { placement: options.placement || "topEnd" }
    )
  }
