// promise로 fs해보기

const fs = require("fs").promises;

let readData = "읽어오지 못했습니다.";

fs.readFile("./readText.txt")
  .then((data) => {
    console.log(data.toString());
    readData = data.toString();
    return fs.writeFile("./writeText3.txt", "텍스트3 : " + readData);
  })
  .then(() => {
    // 다음 then으로 리턴이 됨
    // 이 문장이 실행된 후 return이 실행됨!
    return fs.readFile("./writeText3.txt");
  })
  .then((data3) => {
    console.log("data3 : ", data3.toString());
  })
  .catch((err) => {
    console.error(err);
  });
