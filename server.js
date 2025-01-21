const express = require('express');
const ytdl = require('ytdl-core');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files (like HTML, CSS, JS)
app.use(express.static('public'));

// Middleware to parse incoming form data
app.use(express.urlencoded({ extended: true }));

// Route for video download (YouTube URL)
app.get('/download-video', async (req, res) => {
    const videoUrl = req.query.url;

    if (!ytdl.validateURL(videoUrl)) {
        return res.status(400).send("Invalid URL");
    }

    try {
        const info = await ytdl.getInfo(videoUrl);
        const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_'); // Clean title for filename
        const filePath = path.join(__dirname, 'downloads', `${title}.mp4`);
        
        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        ytdl(videoUrl, { format: 'mp4' }).pipe(res);
    } catch (error) {
        res.status(500).send("Error downloading video");
    }
});

// Route for general file download (for non-YouTube URLs)
app.get('/download-file', async (req, res) => {
    const fileUrl = req.query.url;
    
    try {
        const response = await axios({
            method: 'GET',
            url: fileUrl,
            responseType: 'stream'
        });
        
        const fileName = path.basename(fileUrl);
        res.header('Content-Disposition', `attachment; filename="${fileName}"`);
        response.data.pipe(res);
    } catch (error) {
        res.status(500).send("Error downloading file");
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
