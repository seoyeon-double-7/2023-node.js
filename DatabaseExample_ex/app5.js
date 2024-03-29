/**
 * 데이터베이스 사용하기
 *  * mongoose로 데이터베이스 다루기
 * 모델 객체에 추가한 메소드를 이용해 사용자 조회, 사용자 추가
 *
 * 웹브라우저에서 아래 주소의 페이지를 열고 웹페이지에서 요청
 * (먼저 사용자 추가 후 로그인해야 함)
 *    http://localhost:3000/public/login.html
 *    http://localhost:3000/public/adduser.html
 */

// Express 기본 모듈 불러오기
var express = require("express"),
  http = require("http"),
  path = require("path");

// Express의 미들웨어 불러오기
var bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser"),
  static = require("serve-static"),
  errorHandler = require("errorhandler");

// 에러 핸들러 모듈 사용
var expressErrorHandler = require("express-error-handler");

// Session 미들웨어 불러오기
var expressSession = require("express-session");

// mongoose 모듈 사용
var mongoose = require("mongoose");

var crypto = require("crypto");

// 익스프레스 객체 생성
var app = express();

// 기본 속성 설정
app.set("port", process.env.PORT || 3000);

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }));

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json());

// public 폴더를 static으로 오픈
app.use("/public", static(path.join(__dirname, "public")));

// cookie-parser 설정
app.use(cookieParser());

// 세션 설정
app.use(
  expressSession({
    secret: "my key",
    resave: true,
    saveUninitialized: true,
  })
);

//===== 데이터베이스 연결 =====//

// 데이터베이스 객체를 위한 변수 선언
var database;

// 데이터베이스 스키마 객체를 위한 변수 선언
var UserSchema;

// 데이터베이스 모델 객체를 위한 변수 선언
var UserModel;

//데이터베이스에 연결
function connectDB() {
  // 데이터베이스 연결 정보
  var databaseUrl = "mongodb+srv://cindy:12345@mycloudatlas1.dridqzv.mongodb.net/myuserdb";

  // 데이터베이스 연결
  console.log("데이터베이스 연결을 시도합니다.");
  mongoose.Promise = global.Promise; // mongoose의 Promise 객체는 global의 Promise 객체 사용하도록 함
  mongoose.connect(databaseUrl);
  database = mongoose.connection;

  database.on(
    "error",
    console.error.bind(console, "mongoose connection error.")
  );
  database.on("open", function () {
    console.log("데이터베이스에 연결되었습니다. : " + databaseUrl);

    // 스키마 정의

    createUserSchema();
  });

  // 연결 끊어졌을 때 5초 후 재연결
  database.on("disconnected", function () {
    console.log("연결이 끊어졌습니다. 5초 후 재연결합니다.");
    setInterval(connectDB, 5000);
  });
}

// user 스키마 및 모델 객체 생성
function createUserSchema() {
  // 스키마 정의
  // 패스워드를 hashed_password로 변경, 각 컬럼에 default 속성 모두 추가, salt  속성 추가
  UserSchema = mongoose.Schema({
    id: { type: String, required: true, unique: true, default: "" },
    hashed_password: {
      type: String,
      required: true,
      unique: true,
      default: "",
    },
    salt: { type: String, required: true },
    name: { type: String, index: "hashed", default: "" },
    age: { type: Number, default: -1 },
    created_at: { type: Date, index: { unique: false }, default: Date.now },
    updated_at: { type: Date, index: { unique: false }, default: Date.now },
  });
  // password를 virtual 메소드로 정의 : MongoDB에 저장되지 않는 가상 속성임.
  // 특정 속성을 지정하고 set, get 메소드를 정의함
  UserSchema.virtual("password")
    .set(function (password) {
      this._password = password;
      this.salt = this.makeSalt();
      this.hashed_password = this.encryptPassword(password);
      console.log("virtual password의 set 호출됨 : " + this.hashed_password);
    })
    .get(function () {
      console.log("virtual password의 get 호출됨");
      return this._password;
    });

  // 스키마에 모델 인스턴스에서 사용할 수 있는 메소드 추가
  // 비밀번호 암호화 메소드
  UserSchema.method("encryptPassword", function (plainText, inSalt) {
    if (inSalt) {
      return crypto.createHmac("sha1", inSalt).update(plainText).digest("hex");
    } else {
      return crypto
        .createHmac("sha1", this.salt)
        .update(plainText)
        .digest("hex");
    }
  });

  // salt값 만들기 메소드
  UserSchema.method("makeSalt", function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  });

  // 인증 메소드 - 입력된 비밀번호와 비교(true/false 리턴)
  UserSchema.method(
    "authenticate",
    function (plainText, inSalt, hashed_password) {
      if (inSalt) {
        console.log(
          "authenticate 호출됨: %s - %s: %s, ",
          plainText,
          this.encryptPassword(plainText, inSalt),
          hashed_password
        );
        return this.encryptPassword(plainText, inSalt) === hashed_password;
      } else {
        console.log(
          "authenticate 호출됨: %s - %s: %s, ",
          plainText,
          this.encryptPassword(plainText),
          this.hashed_password
        );
        return this.encryptPassword(plainText) === this.hashed_password;
      }
    }
  );

  var validatePresenceOf = function (value) {
    return value && value.length;
  };

  // 저장시 트리거 함수 정의(password 필드가 유효하지 않으면 에러 발생)
  UserSchema.pre("save", function (next) {
    if (!this.isNew) return next();
    if (!validatePresenceOf(this.password)) {
      next(new Error("유효하지 않은 password 필드입니다."));
    } else {
      next();
    }
  });

  // 필수 속성에 대한 유효성 확인 (길이값 체크)
  UserSchema.path("id").validate(function (id) {
    return id.length;
  }, "id 칼럼의 값이 없습니다.");

  UserSchema.path("name").validate(function (name) {
    return name.length;
  }, "name 칼럼의 값이 없습니다.");

  UserSchema.path("hashed_password").validate(function (hashed_password) {
    return hashed_password.length;
  }, "hashed_password 칼럼의 값이 없습니다.");

  // 스키마에 static으로 findById 메소드 추가
  UserSchema.static("findById", function (id, callback) {
    return this.find({ id: id }, callback);
  });

  // 스키마에 static으로 findAll 메소드 추가
  UserSchema.static("findAll", function (callback) {
    return this.find({}, callback);
  });

  console.log("UserSchema 정의함.");

  // UserModel 모델 정의
  UserModel = mongoose.model("users3", UserSchema);
  console.log("UserModel 정의함.");
}

//===== 라우팅 함수 등록 =====//

// 라우터 객체 참조
var router = express.Router();

// 로그인 라우팅 함수 - 데이터베이스의 정보와 비교
router.route("/process/login").post(function (req, res) {
  console.log("/process/login 호출됨.");

  // 요청 파라미터 확인
  var paramId = req.body.id || req.query.id;
  var paramPassword = req.body.password || req.query.password;

  console.log("요청 파라미터 : " + paramId + ", " + paramPassword);

  // 데이터베이스 객체가 초기화된 경우, authUser 함수 호출하여 사용자 인증
  if (database) {
    authUser(database, paramId, paramPassword, function (err, docs) {
      // 에러 발생 시, 클라이언트로 에러 전송
      if (err) {
        console.error("로그인 중 에러 발생 : " + err.stack);

        res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
        res.write("<h2>로그인 중 에러 발생</h2>");
        res.write("<p>" + err.stack + "</p>");
        res.end();

        return;
      }

      // 조회된 레코드가 있으면 성공 응답 전송
      if (docs) {
        console.dir(docs);

        // 조회 결과에서 사용자 이름 확인
        var username = docs[0].name;

        res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
        res.write("<h1>로그인 성공</h1>");
        res.write("<div><p>사용자 아이디 : " + paramId + "</p></div>");
        res.write("<div><p>사용자 이름 : " + username + "</p></div>");
        res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
		res.write("<a href='/public/index.html'>홈화면으로 가기</a>");
        res.end();
      } else {
        // 조회된 레코드가 없는 경우 실패 응답 전송
        res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
        res.write("<h1>로그인  실패</h1>");
        res.write("<div><p>아이디와 패스워드를 다시 확인하십시오.</p></div>");
        res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
        res.end();
      }
    });
  } else {
    // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
    res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
    res.write("<h2>데이터베이스 연결 실패</h2>");
    res.write("<div><p>데이터베이스에 연결하지 못했습니다.</p></div>");
    res.end();
  }
});

// 사용자 추가 라우팅 함수 - 클라이언트에서 보내오는 데이터를 이용해 데이터베이스에 추가
router.route("/process/adduser").post(function (req, res) {
  console.log("/process/adduser 호출됨.");

  var paramId = req.body.id || req.query.id;
  var paramPassword = req.body.password || req.query.password;
  var paramName = req.body.text || req.query.text;

  console.log(
    "요청 파라미터 : " + paramId + ", " + paramPassword + ", " + paramName
  );

  // 데이터베이스 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
  if (database) {
    addUser(
      database,
      paramId,
      paramPassword,
      paramName,
      function (err, addedUser) {
        // 동일한 id로 추가하려는 경우 에러 발생 - 클라이언트로 에러 전송
        if (err) {
          console.error("사용자 추가 중 에러 발생 : " + err.stack);

          res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
          res.write("<h2>사용자 추가 중 에러 발생</h2>");
          res.write("<p>" + err.stack + "</p>");
          res.end();

          return;
        }

        // 결과 객체 있으면 성공 응답 전송
        if (addedUser) {
          console.dir(addedUser);

          res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
          res.write("<h2>사용자 추가 성공</h2>");
		  res.write("<br><br><a href='/public/index.html'>다시 로그인하기</a>");
          res.end();
        } else {
          // 결과 객체가 없으면 실패 응답 전송
          res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
          res.write("<h2>사용자 추가  실패</h2>");
          res.end();
        }
      }
    );
  } else {
    // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
    res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
    res.write("<h2>데이터베이스 연결 실패</h2>");
    res.end();
  }
});

//사용자조회함수 추가<<<추가app4.js
router.route("/process/listuser").post(async function (req, res) {
  console.log("/process/listuser 호출됨.");

  // 데이터베이스 객체가 초기화된 경우, 모델 객체의 findAll 메소드 호출
  if (database) {
    // 1. 모든 사용자 검색
    try {
      const results = await UserModel.findAll();

      if (results) {
        // 결과 객체 있으면 리스트 전송
        console.dir(results);

        res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
        res.write("<h2>사용자 리스트</h2>");
        res.write("<div><ul>");

        for (var i = 0; i < results.length; i++) {
          var curId = results[i]._doc.id;
          var curName = results[i]._doc.name;
          res.write("    <li>#" + i + " : " + curId + ", " + curName + "</li>");
        }

        res.write("</ul></div>");

		res.write("<br/><a href='/public/index.html'>홈화면으로 가기</a>");
        res.end();
      } else {
        // 결과 객체가 없으면 실패 응답 전송
        res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
        res.write("<h2>사용자 리스트 조회  실패</h2>");
        res.end();
      }
    } catch (err) {
      console.error("사용자 리스트 조회 중 에러 발생 : " + err.stack);
      res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
      res.write("<h2>사용자 리스트 조회 중 에러 발생</h2>");
      res.write("<p>" + err.stack + "</p>");
      res.end();
      return;
    }
  }
});

// 라우터 객체 등록
app.use("/", router);

//authUser(database, paramId, paramPassword, function(err, docs) {
// 사용자를 인증하는 함수 : 아이디로 먼저 찾고 비밀번호를 그 다음에 비교하도록 함
//몽구스 db model 사용에 따라 authUser(사용자인증함수) 변경 - app4.js
//사용자를 인증하는 함수 - 몽구스, app4.js(findById)
async function authUser(database, id, password, callback) {
  try {
    console.log("authUser 호출됨 : " + id + ", " + password);
    // var users = database.collection('users');
    var docs = await UserModel.findById(id);

    if (docs.length > 0) {
      // 조회한 레코드가 있는 경우 콜백 함수를 호출하면서 조회 결과 전달
      console.log(
        "아이디 [%s], 패스워드 [%s] 가 일치하는 사용자 찾음.",
        id,
        password
      );

      var user = new UserModel({ id: id });

      var authenticated = user.authenticate(
        password,
        docs[0]._doc.salt,
        docs[0]._doc.hashed_password
      );
      if (authenticated) {
        console.log("비밀번호 일치함");
        callback(null, docs);
      } else {
        console.log("일치하는 사용자를 찾지 못함.");
        callback(null, null);
      }
    }
  } catch (err) {
    console.error("데이터베이스 연결에 실패했습니다:", err);
    callback(err, null);
    return;
  }
}

//몽구스 db 사용에 따라 adduser(사용자추가함수) 변경 - app3.js
async function addUser(database, id, password, name, callback) {
  try {
    console.log("addUser 호출됨 : " + id + ", " + password + ", " + name);

    // UserModel 인스턴스 생성
    var user = new UserModel({ id: id, password: password, name: name });

    // save()로 저장 : 저장 성공 시 addedUser 객체가 파라미터로 전달됨
    var addedUser = await user.save(addedUser);

    if (user) {
      console.log("사용자 데이터 추가함.");
      callback(null, addedUser);
    } else {
      console.log("사용자 데이터 추가하지 못함.");
      callback(null, null);
    }
  } catch (err) {
    console.log(err);
  }
}

// 404 에러 페이지 처리
var errorHandler = expressErrorHandler({
  static: {
    404: "./public/404.html",
  },
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

//===== 서버 시작 =====//

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on("SIGTERM", function () {
  console.log("프로세스가 종료됩니다.");
  app.close();
});

app.on("close", function () {
  console.log("Express 서버 객체가 종료됩니다.");
  if (database) {
    database.close();
  }
});

// Express 서버 시작
http.createServer(app).listen(app.get("port"), function () {
  console.log("서버가 시작되었습니다. 포트 : " + app.get("port"));

  // 데이터베이스 연결을 위한 함수 호출
  connectDB();
});
