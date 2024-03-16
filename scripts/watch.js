const server = "ws://127.0.0.1:3000"
const ws = new WebSocket(server);

function init() {
    connection = document.querySelector("div");
    names = document.querySelector("p");
    source = document.querySelector("img");

    ws.onmessage = async function (e) {
        if (e !== null && e !== undefined) {
            data = JSON.parse(e.data);
            connection.innerHTML = data.connection;
            names.innerHTML = data.name;
            source.src = data.data;
        }
	}
}