// 화살표 함수 this

const relationship1 = {
    name: "one",
    friends: ["hi", "hello", "bye"],
    logFriends: function() {
        var that = this;    // this 는 relationship1을 가리킴
        this.friends.forEach(function(friend){
            console.log(that.name, friend);    // 함수안의 this는 함수자체이므로 this를 저장하고 사용
        });
    }
}

relationship1.logFriends();


console.log("-------------------");


const relationship2 = {
    name: "one",
    friends: ["hi", "hello", "bye"],
    logFriends: function() {
        this.friends.forEach((friend)=>{
            console.log(this.name, friend);    
            // 화살표 함수를 사용하면 함수안과 밖의 this가 같다.
        });
    }
}

relationship2.logFriends();