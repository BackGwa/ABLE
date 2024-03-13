// 웹 소켓 설정
const server = "ws://192.168.0.25:3000"
const ws = new WebSocket(server);

function init() {
    source = document.querySelector("img");

    ws.onmessage = async function (e) {
        if (e !== null && e !== undefined) {
            data = await JSON.parse(e.data);
            console.log(data);
            source.src = data;
        }
	}
}