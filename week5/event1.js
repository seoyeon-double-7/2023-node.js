const EventEmitter = require('events');

let emitter = new EventEmitter();

// 1. 핸들러, 리스너 등록
// 1-1. 아래 두 문장은 같은 역할을 한다. 방법의 차이
emitter.addListener('event1', func_print);
emitter.on('event1', func_print);

// 1-2. once는 한번만 유효한 이벤트로 등록된다
emitter.once('event1', func_print);

// 2. 이벤트 발생
emitter.emit('event1', '메시지1');
emitter.emit('event1', '메시지2');


// 3. 이벤트 제거
emitter.removeListener('event1', func_print);

emitter.emit('event1', '메시지3');


function func_print(msg){
    console.log("내용 : ", msg);
}