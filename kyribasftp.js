let Client = require('ssh2-sftp-client');
let sftp = new Client();

var fs = require("fs");
let debug = 1;
fs.readFile('test.txt', 'utf8', (err, largeString) => {

    async function uploadFile(filePath, iteration) {
        let fileSize = 0;
        let filecontent = '';

        if (debug === 0) {
            var stats = fs.statSync(filePath)
            fileSize = stats.size;
            console.log(fileSize)
        } else {
            //filecontent = 'THIS!IS!TO!TEST!THE!UPLOAD!TO!KYRIBA!SERVER!WHERE!WE!HAVE!SOME!ISSUES!WITH!THE!LARGE!FILE!SIZE.!PLEASE!STAY!UPDATED!ON!THIS!THANKS!1234567890123456*1234567890ABC$'
            filecontent = largeString;
            fileSize = filecontent.length;
        }

        if (iteration === 0) {
            await sftp.connect({
                host: '',
                port: '22',
                username: '',
                password: '',
            });
        }

        if (debug === 0) {
            //Not debug = 0
            await sftp.fastPut(filePath, 'in/' + filePath, {
                step: (step) => {
                    const percent = Math.floor((step / fileSize) * 100);
                    process.stdout.write("\r PERCENT: " + percent + "\n");
                }
            });
        } else {
            //Debug = 1
            await sftp.fastPut(filecontent, 'in/' + filePath, {
                step: (step) => {
                    const percent = Math.floor((step / fileSize) * 100);
                    process.stdout.write("\r PERCENT: " + percent);
                }
            });
        }



        console.log(`${filePath} has been uploaded`);
    }

    async function main() {
        let files = ['test.txt'];

        let iter = 0;
        for (let file of files) {

            await uploadFile(file, iter);
            iter += 1;
        }

        await sftp.end();
    }

    main();
});
