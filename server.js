var http = require('http');

var maxInFlightCount = 0,
    inFlightCount = 0;

http.createServer(function (req, res) {
    inFlightCount++;
    if (inFlightCount > maxInFlightCount) {
        maxInFlightCount = inFlightCount;
    }
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Content-Length': '13'
    });
    setTimeout(function(){
        res.end("Hello World!!");
        inFlightCount--;
    }, 50);
}).listen(8080, '127.0.0.1');

setInterval(function(){
    console.log("Current in flight: " + inFlightCount);
    console.log("Max in flight: " + maxInFlightCount);
}, 10000);

console.log('Server running at http://127.0.0.1:8080/');
