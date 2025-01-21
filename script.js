document.getElementById('download-form').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const url = document.getElementById('url').value;
    const status = document.getElementById('status');
    
    status.innerHTML = 'Downloading... Please wait!';
    
    // Check if URL is a YouTube URL
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        window.location.href = `/download-video?url=${encodeURIComponent(url)}`;
    } else {
        window.location.href = `/download-file?url=${encodeURIComponent(url)}`;
    }
});
