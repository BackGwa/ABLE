const WebSocket = require("ws");

// 공유 및 시청 웹 소켓 열기
const sharing_wss = new WebSocket.Server({ port: 72 });
const watching_wss = new WebSocket.Server({ port: 144 });

// 공유 및 시청 세트 생성
const sharing_clients = new Set();
const watching_clients = new Set();

// 서버 시작 후 
function main() {
    reg_event(sharing_wss, sharing_clients);        // 공유 클라이언트 이벤트 등록
    reg_event(watching_wss, watching_clients);      // 시청 클라이언트 이벤트 등록
}

// 입/퇴장 이벤트 등록
function reg_event(wss, clients) {
    wss.on("connection", (client) => {              // 클라이언트 입장 시,
        clients.add(client);                        // 클라이언트 세트에 추가
        if (wss == sharing_wss)                     // 공유 클라이언트라면,
            recv_data(clients, client)              // 데이터 수신 후 전송
        
        client.on("close", () => {                  // 클라이언트 퇴장 시,
            clients.delete(client);                 // 클라이언트 세트에서 제거
            if (sharing_clients.size < 1)           // 클라이언트 세트에 클라이언트가 없다면,
            send_data(                              // 클라이언트 없음 데이터 전송
                watching_clients,
                { connect : 0 }
            );
        })
    });

}

// 데이터 수신 후 전송
function recv_data(clients, client) {
    client.on("message", (data) => {                // 데이터 수신 시,
        data = JSON.parse(data.toString());         // 데이터를 문자열로 변경 후, JSON 파싱
        data = proc_data(clients, client, data);    // 파싱 한 데이터 프로세싱
        send_data(watching_clients, data);          // 시청 클라이언트에 데이터 전송
    });
}

// 데이터 프로세싱
function proc_data(clients, client, data) {
    return {
        connect : clients.size,                     // 연결 된 클라이언트 수
        index: Array.from(clients).indexOf(client), // 현재 클라이언트 번호
        nickname: data.nickname,                    // 클라이언트의 이름
        screen: data.screen                         // 클라이언트 스크린 데이터
    }
}

// 데이터 전송
function send_data(clients, data) {
    for (const client of clients) {                 // 각각의 클라이언트에게
        client.send(JSON.stringify(data));          // JSON 형식으로 데이터 전송
    }
}

// 서버 시작
main();