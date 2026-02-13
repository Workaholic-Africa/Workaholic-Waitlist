document.addEventListener('DOMContentLoaded', () => {
    const appShowcaseModal = document.getElementById('appShowcaseModal');
    const showcaseVideo = document.getElementById('showcaseVideo');

    if (appShowcaseModal && showcaseVideo) {
        // When modal is opened, play the video
        appShowcaseModal.addEventListener('shown.bs.modal', () => {
            showcaseVideo.play();
        });

        // When modal is closed, pause the video and reset time
        appShowcaseModal.addEventListener('hidden.bs.modal', () => {
            showcaseVideo.pause();
            showcaseVideo.currentTime = 0;
        });
    }
});
