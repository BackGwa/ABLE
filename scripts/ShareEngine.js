class ShareEngine {
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
        const canvas = document.createElement('canvas');
        canvas.width = this.video.videoWidth;
        canvas.height = this.video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/png');
    }
}