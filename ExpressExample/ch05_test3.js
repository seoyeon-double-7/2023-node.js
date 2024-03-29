var http = require('http');

//웹 서버 객체 생성
var server = http.createServer();

//웹서버 3000 포트에서 시작
var port = 3000;
server.listen(port, function(){
    console.log('웹서버 시작되었습니다.', port)
});

server.on('connection', function(socket){
    console.log('클라이언트가 접속했습니다.: ', socket.remoteAddress, socket.remotePort);
});

server.on('request', function(req, res){
    console.log('클라이언트 요청이 들어왔습니다.');
    
    res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});
    res.write("<!DOCTYPE html>");
    res.write("<html>");
    res.write(" <head>");
    res.write("     <title>응답 페이지</title>");
    res.write(" </head>");
    res.write(" <body>");
    res.write("     <h1>노드제이에스로부터 응답 페이지</h1>");
    res.write("</body>");
    res.write("<html>");
});

server.on('close', function(){
    console.log('서버가 종료됩니다.');
})