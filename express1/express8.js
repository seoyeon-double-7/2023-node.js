// static 미들웨어
// 이미지 파일, 자바스크립트, css 팡리 등

const express = require("express");

const app = express();

app.use(express.static(__dirname + "/public"));

app.use(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end("<img src='/코알라.jpg' width='100%'>");
});
app.listen(8089, function () {
  console.log("8089 포트입니다.");
});
