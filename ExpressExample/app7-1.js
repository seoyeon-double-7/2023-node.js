//express 기본 모듈
var http = require('http');
var express = require('express');

// express 미들웨어
// bodyParser : 클라이언트인 html파일에서 서버로 보낼데이터를 파싱
var bodyParser = require('body-parser');

// static 미들웨어 : 특정 폴더의 파일들을 특정 패스로 접근할 수 있도록 열어주는 역할을 함
var static = require('serve-static');
var path = require('path');

//express 객체 생성
var app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());
app.use('/public', static(path.join(__dirname, 'public')));
//app.use(static(path.join(__dirname, 'public')));

//미들웨어에서 파라미터 확인
app.use(function(req,res){
    console.log('첫번째 미들웨어에서 요청 처리');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write(`<h1>express 서버에서 응답함</h1>`);
    res.write(`<div>param id: ${paramId}</div>`);
    res.write(`<div>param pw: ${paramPassword}</div>`);
    res.end();
    // res.redirect('/');
})

//Express 서버 시작
http.createServer(app).listen(3000, function(){
    console.log('Express 서버가 3000번 포트에서 시작됨 http://localhost:3000/?id=admin&password=1234');
})