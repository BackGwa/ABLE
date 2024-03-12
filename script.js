let share_stat = false;

let video;
let sound;

let pending;
let title;
let subtitle;
let btn1;
let btn2;

window.onload = async () => {
    video = document.getElementById('screen');
    sound = document.getElementById('sound');
    pending = document.querySelector(".pending");
    title = document.querySelector(".title");
    subtitle = document.querySelector(".subtitle");
    btn1 = document.querySelector("#btn1");
    btn2 = document.querySelector("#btn2");
}

function share_button() {
    if (!share_stat) {
        share_start()
    } else {
        share_stop()
    }
}

async function share_start() {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        share_stat = true;
        sound.src = "./res/sound/start.mp3";
        sound.play();
        video.srcObject = stream;
        video.autoplay = true;
        pending.classList.add('shared');
        title.innerText = "SHARING";
        subtitle.classList.add('hidden');
        btn1.classList.add('focus');
        btn2.classList.add('smaller-hidden');
        btn1.querySelector('.inner-content').innerText = 'STOP SHARING';
    } catch (err) {
        btn1.querySelector('.inner-content').innerText = err.name;
        btn1.classList.add('error-animation');
        sound.src = "./res/sound/error.mp3";
        sound.play();
        console.error(err);
        setTimeout(() => {
            btn1.querySelector('.inner-content').innerText = 'SHARE';
            btn1.classList.remove('error-animation');
        }, 2000);
    }
}

function share_stop() {
    share_stat = false;
    sound.src = "./res/sound/stop.mp3";
    sound.play();
    video.srcObject = null;
    video.autoplay = false;
    pending.classList.remove('shared');
    title.innerText = "PLAYLABS";
    subtitle.classList.remove('hidden');
    btn1.classList.remove('focus');
    btn2.classList.remove('smaller-hidden');
    btn1.querySelector('.inner-content').innerText = 'SHARE';
}