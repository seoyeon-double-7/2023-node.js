// setTimeout(함수, 지연시간[밀리초])
// 1000 => 1초
// 비동기처리 됨

setTimeout(()=> console.log("5초 경과"), 5000);
setTimeout(func_towSec, 2000);

function func_towSec(){
    console.log("2초 경과");
}

// 2초마다 난수가 출력
const interval_random = setInterval(
    ()=> console.log(Math.floor(Math.random()*10)), 2000);

setTimeout(()=>{
    console.log("10초 경과");
    clearInterval(interval_random); // 난수 출력 10초 지나면 종료
},10000)