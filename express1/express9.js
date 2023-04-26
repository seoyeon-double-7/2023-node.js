// npm install cookie-parser
// cookie parser 미들웨어 -> 요청 쿠키를 추출할 수 있다.
// request 객체와 response 객체에 cookies 속성과 cookie라는 메서드가 부여

const cookieParser = require("cookie-parser");
const express = require("express");

const app = express();

app.use(cookieParser());
app.get("/getCookie", (req, res) => {
  res.send(req.cookies);
});
app.get("/setCookie", (req, res) => {
  // 쿠키생성
  res.cookie("st", "abc");
  res.cookie("st", {
    name: "배서연",
    age: 6
  });
  res.redirect("/getCookie");
});

app.listen(8089, function () {
  console.log("8089 포트입니다.");
});
