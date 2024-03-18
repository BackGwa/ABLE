// 라이브러리 클래스 초기화
const audio = new AudioEngine();
const share = new ShareEngine();

// 상태 변수
let ws;
let share_stat = false;
let watch_stat = false;

// 페이지 엘리먼트 등록
function init() {
    video = document.querySelector("#screen");
    sound = document.querySelector("#sound");
    content = document.querySelector(".content-area");
    pending = document.querySelector(".pending");
    title = document.querySelector(".title");
    subtitle = document.querySelector(".subtitle");
    btn1 = document.querySelector("#btn1");
    btn2 = document.querySelector("#btn2");
    nickname = prompt("NICKNAME");
}

// SHARE 버튼
async function share_btn() {  
    // 공유 중이 아니면, 공유 시작
    if (!share_stat) {
        try {
            share_stat = await share.start(video);
            audio.play("./res/sound/start.mp3");
            start_share();
        }
        catch (err) { error(err); }
    } else {
        share_stat = !share.stop();
        audio.play("./res/sound/stop.mp3");
        stop_share();
    }

    // 현재 공유 상태에 따른, 공유 상태 업데이트
    if (share_stat) {
        ws = new WebSocket("ws://127.0.0.1:72");
        is_share = setInterval(() => {
            send_data();
        }, 1000 / 30);
    } else {
        ws.close();
        clearInterval(is_share);
    }
}

// WATCH 버튼
function watch_btn() {
    if (!watch_stat) {
        document.documentElement.requestFullscreen();
        watch_stat = true;
    } else {
        document.exitFullscreen();
        watch_stat = false;
    }

    if (watch_stat) {
        audio.play("./res/sound/join.mp3");
        start_watch();
    } else {
        audio.play("./res/sound/leave.mp3");
        stop_watch();
    }
}

// 공유 시작 시, 엘리먼트 업데이트
function start_share() {
    title_rename("SHARING");
    btn1_rename("STOP SHARING");
    video.classList.add("video-move");
    pending.classList.add("shared");
    subtitle.classList.add("hidden");
    btn1.classList.add("focus");
    btn2.classList.add("smaller-hidden-r");
}

// 공유 종료 시, 엘리먼트 업데이트
function stop_share() {
    title_rename();
    btn1_rename();
    video.classList.remove("video-move");
    pending.classList.remove("shared");
    subtitle.classList.remove("hidden");
    btn1.classList.remove("focus");
    btn2.classList.remove("smaller-hidden-r");
}

// 보기 시작 시, 엘리먼트 업데이트
function start_watch() {
    title_rename("WATCHING");
    subtitle_rename("WATCHING");
    btn2_rename("STOP");
    subtitle_rename("CONNECTING...");
    btn1.classList.add("smaller-hidden-l");
}

// 보기 종료 시, 엘리먼트 업데이트
function stop_watch() {
    title_rename();
    btn2_rename();
    subtitle_rename();
    btn1.classList.remove("smaller-hidden-l");
}

// 스크린 데이터 전송
function send_data() {
    const screen = share.data();
    ws.send(JSON.stringify({
        nickname: nickname,
        screen: screen
    }));
}

// 제목 내용 변경
function title_rename(content = "PLAYLABS") {
    title.innerText = content;
}

// 부제목 내용 변경
function subtitle_rename(content = "MAKER SPACE") {
    subtitle.innerText = content;
}

// SHARE 버튼 내용 변경
function btn1_rename(content = "SHARE") {
    btn1.querySelector(".inner-content").innerText = content;
}

// WATCH 버튼 내용 변경
function btn2_rename(content = "WATCH") {
    btn2.querySelector(".inner-content").innerText = content;
}

// 오류 출력
function error(err) {
    share.stop();
    audio.play("./res/sound/error.mp3");
    btn1.classList.add("error-animation");
    btn1_rename(err.name);
    setTimeout(() => {
        btn1.classList.remove("error-animation");
        btn1_rename();
    }, 2000);
}