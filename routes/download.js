var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var lineReader = require('line-reader');
var fetch = require('node-fetch');
var file = require('../assets/file');
var downloadPause=false;
var downloadComplete=false;
var downloadRow= 0;
var Terminatedownloading= false;
var isDownloading=false;

router.post('/downloadPause', (req, res) => {
    if (!isDownloading)
        res.send("Start Downloading First");
    else {
        console.log("should be paused here");
        downloadPause = true;
        res.redirect('/');
    }
})

router.post('/downloadResume', (req, res) => {
    if (!isDownloading)
        res.send('Start Downloading First');
    else {
        downloadPause = false;
        fetch('http://localhost:3000/download', { method: 'POST' });
        res.redirect('/');
    }
})

router.post('/download', (req, res) => {
    isDownloading = true;
    if (fs.existsSync('./uploads/' + file)) {
        if (downloadComplete)
            res.send("Download Completed");
        else {
            var downCurrRow = 0;
            console.log(downloadRow);
            lineReader.eachLine('./uploads/' + file, (line, last) => {

                if (downCurrRow >= downloadRow && downloadPause == false) {

                    line = line + '\n';
                    fs.appendFile('./downloads/' + file, line, function (err) {
                        if (err) console.log(err.message);
                        console.log("downCurrRow:" + downCurrRow);
                        downloadRow++;
                        downCurrRow++;
                        if (last) {
                            downloadComplete = true;
                            toSend = "downloading Complete";
                            if (Terminatedownloading) {
                                fs.unlinkSync('./downloads/' + file);
                                toSend = "Terminated Download"
                            }
                            res.send(toSend);
                        }
                    })
                }
                else
                    downCurrRow++;
            });
        }
    }
    else {
        isDownloading = false;
        res.send('Upload a File First');
    }
})

router.post('/downloadTerminate', async (req, res) => {
    try {
        if (!isDownloading)
            res.send("Start Downloading First");
        else {
            downloadRow = 0;
            await fs.unlink('./downloads/' + file);
            Terminatedownloading = true;
            res.send("Terminated");
        }

    } catch (error) {
        console.log(error);
        res.redirect('/');
    }

});

module.exports = router;