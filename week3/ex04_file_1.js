const fs = require('fs');

let readData = "읽어오지 못했습니다.";

fs.readFile("./readText.txt", (err, data)=>{
    // 문제가 생기면 err에 값이 들어옴
    if(err){
        throw err;
    }
    
    console.log(data.toString());
    readData = data.toString();
})

fs.writeFile("./writeTest.txt", ("읽어온 데이터 : " + readData),(err, data)=>{
    if(err){
        throw err;
    }
    
    console.log("파일쓰기 완료");
})