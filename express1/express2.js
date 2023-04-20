// npm init
// npm install express

// 모듈 가져오기
const express = require("express");

// 서버 생성하기
const app = express();

app.use(function (req, res) {
  let name = req.query.name;
  let area = req.query.area;

  res.send(`<h1>${name} : ${area}</h1>`)


});

app.listen(8089, () => {
  console.log("port 8089로 실행합니다.");
});
