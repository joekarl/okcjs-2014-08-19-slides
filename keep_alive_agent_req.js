var http = require('http');
var Agent = require('agentkeepalive');

var keepaliveAgent = new Agent({
  maxSockets: 100,
  maxFreeSockets: 5,
  keepAliveTimeout: 30000 // free socket keepalive for 30 seconds
});

var numberOfRequesters = 150,
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
                agent: keepaliveAgent
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
