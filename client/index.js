let conn = null

class Event {
    constructor(type, payload) {
        this.type = type;
        this.payload = payload;
    }
}

class SendMessageEvent {
    constructor(message, from) {
        this.message = message;
        this.from = from;
    }
}

class NewMessageEvent {
    constructor(message, from, sent) {
        this.message = message;
        this.from = from;
        this.sent = sent
    }
}

function routeEvent(event) {
    if (event.type === undefined) {
        alert("no type field in the event")
    }

    switch (event.type) {
        case "new_message":
            const messageEvent = Object.assign(new NewMessageEvent, event.payload)
            appendChatMessage(messageEvent)
            break;
        default:
            alert("unsupported message type");
            break;
    }
}

function appendChatMessage(messageEvent) {
    let date = new Date(messageEvent.sent);
    const formattedMsg = `${date.toLocaleDateString()}: ${messageEvent.message}`;
    let textarea = document.getElementById("chatmessages");
    textarea.innerHTML += formattedMsg + "\n";
    textarea.scrollTop = textarea.scrollHeight;
}

function sendEvent(eventName, payload) {
    const event = new Event(eventName, payload);
    conn.send(JSON.stringify(event));
}

function sendMessage() {
    let newMessage = document.getElementById("message");

    if (newMessage != null) {
        let outgoing = new SendMessageEvent(newMessage.value, "sender")
        sendEvent("send_message", outgoing);
    }
    return false;
}

window.onload = function () {
    if (window.WebSocket) {
        document.getElementById("chatroom-message").onsubmit = sendMessage;

        conn = new WebSocket("ws://" + document.location.host + "/websocs");

        conn.onmessage = function (evt) {
            const eventData = JSON.parse(evt.data);

            const event = Object.assign(new Event, eventData);

            routeEvent(event);
        }
    } else {
        alert("Browser doesn't support websockets");
    }
};