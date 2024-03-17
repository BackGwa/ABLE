class ShareEngine {
    constructor() {
        this.canvas = document.createElement('canvas');
    }

    async start(video) {
        this.video = video;
        this.stream = await navigator.mediaDevices.getDisplayMedia({ video : true });
        this.video.srcObject = this.stream;
        return true;
    }
    
    stop() {
        this.stream = null;
        this.video.srcObject = null;
        return true;
    }

    data() {
        const aspectRatio = this.video.videoWidth / this.video.videoHeight;

        if (aspectRatio > 1920 / 1080) {
            this.canvas.width = 1920;
            this.canvas.height = 1920 / aspectRatio;
        } else {
            this.canvas.height = 1080;
            this.canvas.width = 1080 * aspectRatio;
        }
        
        const ctx = this.canvas.getContext('2d');
        ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        return this.canvas.toDataURL("image/jpeg", 0.5);
    }
}