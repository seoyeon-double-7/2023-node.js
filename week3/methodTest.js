const http = require('http');
const url = require('url');

const server = http.createServer();

server.on('request',(req, res)=>{
    console.log("method : ", req.method);
    console.log("url1", req.url);
    console.log("url2", url.parse(req.url));
    console.log("url2-1", url.parse(req.url).pathname);
    console.log("url3", url.parse(req.url).query);
    console.log("url4", url.parse(req.url, true).query);
    let queryObj = url.parse(req.url, true).query;

    if(req.method == "GET"){
        console.log("GET 요청");
    }else if(req.method == "POST"){
        console.log("POST 요청");
    }
    res.writeHead(200, {'content-type':'text/html'});
    res.write('<!DOCTYPE html><html><head><meta charset="utf-8" /><title>Node.js 시작</title></head><body>');
    res.write(`<h1>요청타입은 ${req.method} 입니다.</h1>`);
    res.write(`<h1> path는 ${url.parse(req.url).pathname} 입니다.</h1>`);
    res.write(`<h1> 쿼리는 ${JSON.stringify(queryObj)} 입니다.</h1>`);
    res.end('</body></html>')
})

server.listen(3000, ()=>{
    console.log("server listening");
})