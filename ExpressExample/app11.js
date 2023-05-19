/*
* 쿠키는 클라이언트 웹 브라우저에 저장되는 정보, 세션은 웹 서버에 저장되는 정보
* 웹서버에서 응답할 때 쿠키를 설정하여 그 정보를 받은 웹브라우저에서 쿠키 저장
* 웹브라우저에서 웹서버로 요청할 때 쿠키 정보 전송
* 응답할 때 응답 객체에 쿠키 설정 : res.cookie() 메소드 호출
* 요청 객체에 들어있는 쿠키 확인 : req.cookies 객체 안의 속성으로 확인

*/

//express 기본 모듈
var http = require("http");
var express = require("express");

// express 미들웨어
// bodyParser : 클라이언트인 html파일에서 서버로 보낼데이터를 파싱
var bodyParser = require("body-parser");

// static 미들웨어 : 특정 폴더의 파일들을 특정 패스로 접근할 수 있도록 열어주는 역할을 함
var static = require("serve-static");
var path = require("path");

// 에러 핸들러
var expressErrorHandler = require('express-error-handler')

//express 객체 생성
var app = express();
app.set("port", process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use("/public", static(path.join(__dirname, "public")));

// router : 요청 라우팅, 요청 패스에 따라 다르게 처리
var router = express.Router();

// cookie-parser 설정
var cookieParser = require('cookie-parser');
app.use(cookieParser());

// 응답객체의 cookie()메소드 호출
router.route('/process/setUserCookie').get(function(req, res) {
    console.log('/process/setUserCookie 호출됨.');
    // 쿠키 설정
    res.cookie('user', {
    id: 'sunny',
    name: '소녀시대',
    authorized: true
    });
    // redirect로 응답
    res.redirect('/process/showCookie');
    });

// showCookie 요청패스에서 쿠키 종보 표시
// 요청 객체의 cookies 속성 사용

router.route('/process/showCookie').get(function(req, res) {
    console.log('/process/showCookie 호출됨.');
    
    res.send(req.cookies);
    });

// 라우터 객체를 app 객체에 등록
app.use("/", router);

// 404에러 페이지 처리
var errorHandler = expressErrorHandler({
  static: {
    404: "./public/404.html",
  },
});
app.use(expressErrorHandler.httpError(404))
app.use(errorHandler);


//Express 서버 시작
http.createServer(app).listen(3000, function () {
  console.log(
    "Express 서버가 3000번 포트에서 시작됨 http://localhost:3000/"
  );
});
