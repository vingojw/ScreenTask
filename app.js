require('shelljs/global');
 
~function a() {
    setTimeout(function () {
        exec('screencapture -C -r -t jpg -x -m -o ./IMG.jpg');
        a();
    }, 500);
}();
 
//引入http模块
var http = require("http");
var url = require('url');
var fs = require('fs');
var path = require('path');
var os = require('os');
 
//设置主机名
var hostName = function getLocalIp() { //获取内网ip
    var map = [];
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
        if (ifaces[dev][1].address.indexOf('192.168') != -1) {
            return ifaces[dev][1].address;
        }
    }
    return map;
}();
 
//设置端口
var port = 8088;
//创建服务
var server = http.createServer(function (request, response) {
    //console.log(request.url);
    var pathname;
    if (request.url == '/') {
        pathname = 'index.html';
    } else {
        pathname = url.parse(request.url).pathname;
    }
    var realPath = path.join("./", pathname);
    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
 
            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                    var contentType = {
                        "css": "text/css",
                        "gif": "image/gif",
                        "html": "text/html",
                        "ico": "image/x-icon",
                        "jpeg": "image/jpeg",
                        "jpg": "image/jpeg",
                        "js": "text/javascript",
                        "json": "application/json",
                        "pdf": "application/pdf",
                        "png": "image/png",
                        "svg": "image/svg+xml",
                        "swf": "application/x-shockwave-flash",
                        "tiff": "image/tiff",
                        "txt": "text/plain",
                        "wav": "audio/x-wav",
                        "wma": "audio/x-ms-wma",
                        "wmv": "video/x-ms-wmv",
                        "xml": "text/xml"
                    }[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
});
server.listen(port, hostName, function () {
    console.log(`服务器运行在http: //${hostName}:${port}`);
});