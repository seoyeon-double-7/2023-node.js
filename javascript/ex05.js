// 구조분해 할당

const example = {a:123, b: {c:11, d:16}};

// case1:
// const a = ex.a;
// const d = ex.b.d;

// case2:

const {a, b:{d}} = example;

arr = [1,2,3,4,5];

// case1:
// const x = arr[0];
// const y = arr[1];
// const z = arr[2];

// case 2:
const [x,,y,,z] = arr;

console.log(a,d);

console.log(x,y,z)


// 주의
// 구조분해 할당시 this 사용하면 문제가 됨