var http = require('http');

var maxSocketsAgent = new http.Agent({
    maxSockets: 10
});

var numberOfRequesters = 10,
    i;

for (i = 0; i < numberOfRequesters; ++i) {
    startRequester();
}


var counter = 0;
var lastCountTime = Date.now();

function startRequester() {

    function doRequest() {
        var req = http.request({
                host: "127.0.0.1",
                port: 8080,
                agent: maxSocketsAgent
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
