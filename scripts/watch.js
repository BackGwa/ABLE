// 시청 웹 소켓과 연결
const server = "ws://192.168.0.25:144"
const ws = new WebSocket(server);

// 이전 클라이언트 수
let before_connect = 0;

// 페이지 초기화
function init() {
    container = document.querySelector(".container");
    reg_event();
}

// 이벤트 등록
function reg_event() {
    ws.onmessage = (e) => {                     // 데이터를 수신하였을 때,
        const data = JSON.parse(e.data);        // 수신한 데이터를 JSON으로 파싱
        if (client_update(data.connect)) {      // 클라이언트 업데이트 확인,
            screen_update(                      // 클라이언트 화면 업데이트
                data.index,
                data.nickname,
                data.screen
            );
        }
	}
}

// 클라이언트 업데이트 확인
function client_update(connect) {
    if (connect != 0 && connect == before_connect)  // 이전 클라이언트 수와 차이가 없다면, 무시
        return true;

    if (connect == 0) {                         // 클라이언트 수가 존재하지 않는다면,
        container.innerHTML = "";               // 모든 콘텐츠 요소를 비움
        return false;
    }

    before_connect = connect;                   // 이전 클라이언트 수를 현재 클라이언트 수로 설정
    container.innerHTML = "";                   // 모든 콘텐츠 요소를 비움

    // 클라이언트 수 만큼 콘텐츠 추가
    for (let i = 0; i < connect; i++) {
        container.innerHTML += `<img width="640px" height="480px" id="client_${i}">`;
    }

    return true;
}

// 화면 데이터 업데이트
function screen_update(id, name, data) {
    user = document.querySelector(`#client_${id}`);
    user.src = data;
    user.alt = name;
}