/*
* 쿠키는 클라이언트 웹 브라우저에 저장되는 정보, 세션은 웹 서버에 저장되는 정보
* 웹서버에서 요청 객체에 세션을 설정하면 유지됨 → req.session.세션이름 = 세션객체
* 그 정보를 받은 웹브라우저에서도 connect.sid 쿠키 저장
* 웹브라우저에서 웹서버로 요청할 때 connect.sid 쿠키 정보 전송
* 요청에 들어있는 세션 정보 확인 → req.session.세션이름

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
var expressErrorHandler = require("express-error-handler");

//express 객체 생성
var app = express();
app.set("port", process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use("/public", static(path.join(__dirname, "public")));

// router : 요청 라우팅, 요청 패스에 따라 다르게 처리
var router = express.Router();

// cookie-parser 설정
var cookieParser = require("cookie-parser");
app.use(cookieParser());

// session 미들웨어 설정
var expressSession = require("express-session");
app.use(
  expressSession({
    secret: "my key",
    resave: true,
    saveUninitialized: true,
  })
);

// 로그인 라우팅 함수 - 로그인 후 세션 저장
router.route("/process/login").post(function (req, res) {
  console.log("process/login 호출됨.");

  var paramId = req.body.id || req.query.id;
  var paramPassword = req.body.password || req.query.password;

  if (req.session.user) {
    // 로그인 된 상태
    console.log("이미 로그인 되어 상품 페이지로 이동합니다.");
    res.redirect("/public/product.html");
  } else {
    // 세션 저장
    req.session.user = {
      id: paramId,
      name: "Cindy",
      authorized: true,
    };

    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
    res.write("<h1>로그인 성공</h1>");
    res.write("<div><p>Param id : " + paramId + "</p></div>");
    res.write("<div><p>Param password : " + paramPassword + "</p></div>");
    res.write(
      "<br><br><a href='/process/product'>상품 페이지로 이동하기</a>"
    );
    // router.route('/process/product').get으로 연결됨
    res.end();
  }
});

router.route("/process/logout").get(function (req, res) {
  console.log("/process/logout 호출됨.");
  if (req.session.user) {
    // 로그인된 상태
    console.log("로그아웃합니다.");
    req.session.destroy(function (err) {
      if (err) {
        throw err;
      }
      console.log("세션을 삭제하고 로그아웃되었습니다.");
      res.redirect("/public/login2.html");
    });
  } else {
    // 로그인 안된 상태
    console.log("아직 로그인되어있지 않습니다.");
    res.redirect("/public/login2.html");
  }
});

router.route("/process/product").get(function (req, res) {
  console.log("/process/product 호출됨.");
  // 로그인 되어있으면
  if (req.session.user) {
    res.redirect("/public/product.html");
  } else {
    res.redirect("/public/login2.html");
  }
});

// 라우터 객체를 app 객체에 등록
app.use("/", router);

// 404에러 페이지 처리
var errorHandler = expressErrorHandler({
  static: {
    404: "./public/404.html",
  },
});
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

//Express 서버 시작
http.createServer(app).listen(3000, function () {
  console.log("Express 서버가 3000번 포트에서 시작됐어요이 http://localhost:3000/");
});
