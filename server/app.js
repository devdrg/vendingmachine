require("dotenv").config();
const http = require("http");
// const fs = require("fs");
const cors = require("cors");
const path = require("path");
const logger = require("morgan");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
// const MongoStore = require("connect-mongo")(session);
const MongoStore = require("connect-mongo");
const errorHandler = require("errorhandler");
const cookieParser = require("cookie-parser");
const mongoose = require("./configs/mongoose");
var history = require('connect-history-api-fallback');



const HOST = process.env.VUE_APP_HOST;
const PORT = process.env.VUE_APP_API_URI || process.env.PORT || 3000;
const SECRET = process.env.APP_SECRET || "secretos";
const ENVIROMENT = process.env.NODE_ENV || "development";
const SESSION_KEY = process.env.SESSION_KEY || "express.sid";


const timeNow = new Date;
console.log(timeNow);


const app = express();
app.use(history());

const server = http.createServer(app);
// const io = socketIO(server);
// const io = socketIO(server, {
//     cors: {
//       origin: `http://${process.env.VUE_APP_HOST}:${process.env.VUE_APP_PORT}`,
//       methods: ["GET", "POST"]
//     }
//   });


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
// app.use(bodyParser());

// session store
// const sessionStore = new MongoStore({
//     mongooseConnection: mongoose.connection,
//     collection: "sessions"
// });
const sessionStore = new MongoStore({
    mongoUrl: process.env.DBURI,
    collection: "sessions"
});

app.use(session({
    key: SESSION_KEY,
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    // store: MongoStore.create({ 
    //     mongoUrl: process.env.DBURI}),
    // cookie: {
    //     maxAge: 1000 * 60 * 60 * 24
    // }
}));

if (ENVIROMENT === "development") {
    app.use(logger("dev"));
    app.use(errorHandler());
} else {
    app.use(logger("short"));
}

app.use(passport.initialize());
app.use(passport.session());


// ROUTES
// http
const profileRoutes = require("./routes/http/profile");
const authenticationRoutes = require("./routes/http/auth");
const productRoutes = require("./routes/http/product");
// jwt
const auctionRoutesJWT = require("./routes/jwt/product");

app.use(cors({
    credentials: true,
    origin: true
    // origin: `http://${process.env.VUE_APP_HOST}:${process.env.VUE_APP_PORT}`
}));

// app.use(cors());
// app.options('*', cors());

// const corsConfig = {
//     credentials: true,
//     origin: true,
// };
// app.use(cors(corsConfig));


app
    .use("/api/user", profileRoutes)
    .use("/api/auth", authenticationRoutes)
    .use("/api/products", productRoutes)
    // .use("/api/offers/jwt/", auctionRoutesJWT);

// handle production
if (process.env.ENVIROMENT === "production") {
    // eslint-disable-next-line no-path-concat
    app.use(express.static(__dirname + "/dist/"));
    // eslint-disable-next-line no-path-concat
    app.get(/.*/, (req, res) => res.sendFile(__dirname + "/public/index.html"));
}


app.use("/", express.static(path.join(__dirname, "dist")));

console.log(path.join(__dirname, 'dist', 'index.html'));



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
    // res.send("Hello");
})

console.log(process.env.BASE_URL);




// Static files
app.use(express.static('public'));


// bad request - catches all non existing routes
app.use((req, res) => {
    res.status(404).json({
        error: `Bad request: ${req.method} ${req.originalUrl}`
    });
});


server.listen(PORT, HOST, () => {
    console.log(`Server is running on PORT: ${PORT} in ${ENVIROMENT}`);
});