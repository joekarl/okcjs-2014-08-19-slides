var http = require('http');

var numberOfRequesters = 100,
    i;

http.globalAgent.maxSockets = 50;

for (i = 0; i < numberOfRequesters; ++i) {
    startRequester();
}


var counter = 0;
var lastCountTime = Date.now();

function startRequester() {

    function doRequest() {
        var req = http.request({
                host: "127.0.0.1",
                port: 1337
            }, function(res){
            res.on('data', function() { /* do nothing */ });
            res.on('end', function(){
                counter++;
                if (Date.now() - lastCountTime >= 1000) {
                    console.log("rps: " + counter);
                    counter = 0;
                    lastCountTime = Date.now();
                }
                setImmediate(doRequest);
            });
        });
        req.on('error', function(e) {
            console.log("Got error: " + e.message);
        });
        req.end();
    }

    doRequest(doRequest);
}
