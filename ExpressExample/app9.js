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

// 라우팅 함수 등록
router.route("/process/login/:name").post(function (req, res) {
  console.log("/process/login/:name 처리함.");

  var paramName = req.params.name;

  var paramId = req.body.id || req.query.id;
  var paramPassword = req.body.password || req.query.password;

  res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
  res.write("<h1>Express 서버에서 응답한 결과입니다.</h1>");
  res.write("<div><p>Param name : " + paramName + "</p></div>");
  res.write("<div><p>Param id : " + paramId + "</p></div>");
  res.write("<div><p>Param password : " + paramPassword + "</p></div>");
  res.write(
    "<br><br><a href='/public/login3.html'>로그인 페이지로 돌아가기</a>"
  );
  res.end();
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
    "Express 서버가 3000번 포트에서 시작됨 http://localhost:3000/?id=admin&password=1234"
  );
});
