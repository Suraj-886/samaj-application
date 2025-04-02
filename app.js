const express = require("express");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();
const fileUpload = require("express-fileupload");
app.use(fileUpload());
app.use(
  bodyParser.urlencoded({
    limit: "30mb",
    parameterLimit: 100000,
    extended: false,
  }),
);
app.use(bodyParser.json({ limit: "30mb" }));

const port = 8080;
const server = app.listen(port);
const io = require("socket.io")(server);
const activity = require("./routes/activity");
const category = require("./routes/category");
const audiobooks = require("./routes/audiobooks");
const wishlist = require("./routes/wishlist");
const products = require("./routes/product");
const user = require("./routes/user");
const role = require("./routes/role");
const siteConfig = require("./routes/site-config");
const job = require("./routes/job");
const event = require("./routes/event");
const news = require("./routes/news");
const admin = require("./routes/admin");
const business = require("./routes/business");
const enableDisableUser = require("./routes/user-enable-disable");
const otp = require("./routes/otp");
app.use(cors());
const config = require("./config.json");
const error = require("./middlewares/error");

// Set up mongoose connection
mongoose.Promise = global.Promise;
const dBUrl = config.db.localurl;
mongoose.connect(
  dBUrl,
  // {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   useCreateIndex: true,
  // },
  (err) => {
    if (err) {
      console.log("DB Not Connected", err);
    } else {
      console.log("DB Connected");
    }
  },
);
// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });
app.use((req, res, next) => {
  req.io = io;
  next();
});
// app.use(express.json({ limit: "50mb", extended: true }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/activity", activity);
app.use("/category", category);
app.use("/audiobooks", audiobooks);
app.use("/wishlist", wishlist);

app.use("/user", user);
app.use("/admin", admin);
app.use("/role", role);
app.use("/siteConfig", siteConfig);
app.use("/job", job);
app.use("/events", event);
app.use("/products", products);
app.use("/news", news);
app.use("/business", business);
app.use("/enableDisableUser", enableDisableUser);
app.use("/otp", otp);
// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

app.use(passport.initialize());
app.use(passport.session());
