const { text_odd, text_even } = require("./moduleText")


function checkOddorEven(num){
    if(num % 2){
        return text_odd
    }
    return text_even;
}
module.exports = checkOddorEven;