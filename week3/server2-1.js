2// 노드 서버 만들기

const http = require('http');
const fs = require('fs').promises;


// createServer : 서버 생성
// 요청하고 응답 객체를 받음
const server = http.createServer(async (req, res)=>{

    try{
        const data = await fs.readFile("./server2_html.html");
        res.writeHead(200, {'Content-Type':'text/plain;charset=utf-8'});
        res.end(data);
    }
    catch(err){
        console.error(err);
        res.writeHead(500, {'Content-Type':'text/plain;charset=utf-8'});
        res.end(err.message);
    }
});

server.listen(8088);
// 이벤트
server.on('listening', ()=>{
    console.log("8088번 포트에서 서버가 대기 중입니다.");
});

server.on('error', (error)=>{
    console.error(error);
});