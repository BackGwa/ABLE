
class AudioEngine {
    play(src) {
        var audio = document.createElement('audio');
        audio.src = src;
        document.body.appendChild(audio);
        audio.play();
        audio.onended = () => {
            audio.remove();
        };
    }
}