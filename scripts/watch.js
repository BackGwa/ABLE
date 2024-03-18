// 라이브러리 클래스 초기화
const audio = new AudioEngine();

// 시청 웹 소켓과 연결
const server = "ws://127.0.0.1:144"
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
            if (!username.classList.contains("fade")) {
                username.classList.add("fade");

                setTimeout(() => {
                    username.classList.remove("fade");
                }, 1500)
            }
        } else if (e.keyCode == 37) {
            if (select_client == now_client) select_client = 1;
            else select_client++;
            if (!username.classList.contains("fade")) {
                username.classList.add("fade");

                setTimeout(() => {
                    username.classList.remove("fade");
                }, 1500)
            }
        }
    }

    ws.onmessage = (e) => {                     // 데이터를 수신하였을 때,
        const data = JSON.parse(e.data);        // 수신한 데이터를 JSON으로 파싱
        now_client = data.connect;

        if (now_client == 0) {
            image.src = "https://th.bing.com/th/id/R.93901f8e78d728dfc40d578292f8b647?rik=YYXsZ8uLunEsAQ&riu=http%3a%2f%2ffile3.instiz.net%2fdata%2ffile3%2f2018%2f05%2f05%2f1%2fc%2fd%2f1cdd07939cc168ca86a510622006d904.gif&ehk=8iEYObARM68mKBB3%2bYZOhuHOgxCwO8rg4nXBBaHNX9E%3d&risl=1&pid=ImgRaw&r=0";
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
        }

        if (data.index + 1 == select_client) {
            screen_update(data.nickname, data.screen);
        }
	}
}

// 화면 데이터 업데이트
function screen_update(name, data) {
    image.src = data;
    username.innerText = name;
}