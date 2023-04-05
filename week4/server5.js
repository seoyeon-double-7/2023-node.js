const http = require("http");
const fs = require("fs").promises;

const path = require("path");
const url = require("url");

const server = http.createServer(async (req, res) => {
  try {
    console.log("URL 부분 : ", req.url);

    if (req.url == "/favicon.ico") {
      res.writeHead(404);
      res.end;
    }

    // 지정된 폴더의 파일 리스트를 읽어와서 본문안에 넣기
    const menuFolder = path.join(__dirname, "./textFile");
    console.log("내가 읽고 싶은 폴더 : ", menuFolder);

    // readdir을 활용해서 해당 폴더의 내용 가져오기
    const fileList = fs.readdir(menuFolder);

    // 요소만들기
    let fileListText = "<ul>";
    await fileList.then((file_list) => {
      let ii = 0;
      console.log("file_list", file_list);
      while (ii < file_list.length) {
        let dataData = file_list[ii].replace("menu_", "").replace(".txt", ""); // 파일이름 menu_ 노출x
        fileListText += `<li><a href="/?data=${dataData}">${dataData}</a></li>`;
        ii += 1;
      }
    });
    console.log("log", fileListText);
    fileListText += "</ul>";

    const searchParams = new URL(req.url, "http://localhost:8088/").searchParams;
    console.log("searchParams", searchParams);

    const param_date = searchParams.get("data") || "null";

    const fileName = path.join(__dirname, `./textFile/menu_${param_date}.txt`)
    let fileData = await fs.readFile(fileName);
    let fileDataString = fileData.toString().replace(/\n/g,'<br/>') // 개행을 문자열로 변경
    console.log("텍스트 : ", fileDataString);

    const template = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title> 급식메뉴 </title>
            </head>
            <body>
                <h1><a href="/">급식메뉴</h1>
                ${fileListText}
                <br>
                ${fileDataString}
                
            </body>
        </html>
        `;

    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    res.end(template);
    
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "text/plain;charset=utf-8" });
    res.end(err.message);
  }
});

server.listen(8088);

server.on("listening", () => {
  console.log("8088번 포트에서 서버가 대기 중입니다.");
});

server.on("error", (error) => {
  console.error(error);
});
