const A = require("./globalA");

console.log(A());   // globalA

global.message = "안녕하세요";
console.log(A());