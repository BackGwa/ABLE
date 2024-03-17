const WebSocket = require("ws");

const sharing_wss = new WebSocket.Server({ port: 72 });
const watching_wss = new WebSocket.Server({ port: 144 });

const sharing_clients = new Set();
const watching_clients = new Set();

// 서버 시작 시
function main() {
    // 새로운 공유 클라이언트 연결
    sharing_wss.on("connection", (client) => {
        sharing_clients.add(client);                // 공유 클라이언트 배열에 추가
        recv_data(sharing_clients, client);         // 데이터 수신 예약 
        client_gc(sharing_clients, client);         // 연결 종료된 클라이언트 제거
    });

    // 새로운 시청 클라이언트 연결
    watching_wss.on("connection", (client) => {
        watching_clients.add(client);               // 시청 클라이언트 배열에 추가
        client_gc(watching_clients, client);        // 연결 종료된 클라이언트 제거
    });
}

// 데이터 전송
function send_data(clients, data) {
    const json_data = JSON.stringify(data);
    for (const client of clients) {
        client.send(json_data);
    }
}

// 데이터 수신
function recv_data(clients, client) {
    client.on("message", (client_data) => {
        const data = JSON.parse(client_data.toString());
        const packing_data = proc_data(clients, client, data);
        send_data(watching_clients, packing_data);
    });
}

// 데이터 프로세싱
function proc_data(clients, client, data) {
    return {
        connection: clients.size,
        index: Array.from(clients).indexOf(client),
        nickname: data.nickname,
        screen: data.screen
    }
}

// 연결 종료된 클라이언트 제거
function client_gc(clients, client) {
    client.on("close", () => {
        if (clients.size - 1 == 0) {
            send_data(watching_clients, {
                connection: 0
            });
        }
        clients.delete(client);
    })
}

main();