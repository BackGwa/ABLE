// 라이브러리 클래스 초기화
const audio = new AudioEngine();

// 시청 웹 소켓과 연결
const server = `ws://${prompt("SERVER ADDRESS")}:144`
const ws = new WebSocket(server);

// 이전 클라이언트 수
let now_client = 0;
let before_client = 0;
let select_client = 1;

// 페이지 초기화
function init() {
    container = document.querySelector(".container");
    image = document.querySelector("img");
    username = document.querySelector(".name");
    reg_event();
}

// 이벤트 등록
function reg_event() {
    window.onkeydown = (e) => {
        if (e.keyCode == 39) {
            if (select_client == 1) select_client = now_client;
            else select_client--;
        } else if (e.keyCode == 37) {
            if (select_client == now_client) select_client = 1;
            else select_client++;
        }
        text_update();
    }

    ws.onmessage = (e) => {                     // 데이터를 수신하였을 때,
        const data = JSON.parse(e.data);        // 수신한 데이터를 JSON으로 파싱
        now_client = data.connect;

        if (now_client == 0) {
            image.src = "";
            username.innerText = "비었음";
        }

        if (before_client != now_client) {
            if (before_client > now_client) {
                audio.play("./res/sound/leave.mp3");
                if (select_client > before_client) {
                    select_client = now_client;
                }
            } else {
                audio.play("./res/sound/join.mp3");
            }
            before_client = now_client;
            text_update(data.nickname);
        }

        if (data.index + 1 == select_client) {
            screen_update(data.screen);
        }
	}
}

// 화면 데이터 업데이트
function screen_update(data) {
    image.src = data;
}

// 텍스트 업데이트
function text_update(text = username.innerText) {
    username.innerText = text;
    username.classList.add("fade");
    setTimeout(() => {
        username.classList.remove("fade");
    }, 1500);
}