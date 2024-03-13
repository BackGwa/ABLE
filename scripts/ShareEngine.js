class ShareEngine {
    constructor() {
        this.canvas = document.createElement('canvas');
    }

    async start(video) {
        this.video = video;
        this.stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        this.video.srcObject = this.stream;
        return true;
    }
    
    stop() {
        this.video.srcObject = null;
        return true;
    }

    data() {
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        const ctx = this.canvas.getContext('2d');
        ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        return this.canvas.toDataURL("image/jpeg", 0.5);
    }
}