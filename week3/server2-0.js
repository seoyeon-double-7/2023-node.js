// 노드 서버 만들기

const http = require('http');
const fs = require('fs');


const server = http.createServer((req, res)=>{
    fs.readFile("./server2_html.html", (err,data)=>{
        if(err){
            throw err;
        }
        // HTTP 상태코드
        res.statusCode = 200; // 성공코드
        res.setHeader("Content-Type", "text/html");
        res.end(data);  // 파일 데이터를 더이상 넣어줄 수 없음
    })
});

server.listen(8088, ()=>{
    console.log("8088번 포트에서 서버가 대기 중입니다.");
});

server.on('listening', (error)=>{
    console.log("8088번 포트에서 서버가 대기 중입니다.");
});

server.on('error', (error)=>{
    console.error(error);
});