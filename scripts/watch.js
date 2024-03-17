const server = "ws://127.0.0.1:144"
const ws = new WebSocket(server);

let before_connection = 0;

function init() {
    container = document.querySelector(".container");
    ws.onmessage = async function (e) {
        if (e.data) {
            const data = JSON.parse(e.data);
            user_update(data.connection);
            screen_update(data.index, data.nickname, data.screen);
        }
	}
}

function user_update(connection) {
    if (connection == before_connection)
        return

    if (connection == 0) {
        container.innerHTML = "";
        return
    }

    before_connection = connection;
    container.innerHTML = "";

    for (let i = 0; i < connection; i++) {
        container.innerHTML += `<img width="640px" height="480px" id="client_${i}">`;
    }
}

function screen_update(id, name, data) {
    user = document.querySelector(`#client_${id}`);
    user.src = data;
    user.alt = name;
}