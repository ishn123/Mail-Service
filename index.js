"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const documents_1 = require("./documents");
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const passport_local_1 = __importDefault(require("passport-local"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)({ credentials: true }));
const authUser = (username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    yield documents_1.User.findOne({ email: username, password: password })
        .then((res) => done(null, res))
        .catch((err) => {
        done(null, false);
    });
});
app.use(body_parser_1.default.json());
app.use((0, express_session_1.default)({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.use(new passport_local_1.default.Strategy(authUser));
passport_1.default.serializeUser((user, done) => {
    done(null, user === null || user === void 0 ? void 0 : user._id);
});
passport_1.default.deserializeUser((userObj, done) => {
    console.log("userobj", userObj);
    done(null, userObj);
});
app.get("/fail", (req, res) => {
    res.sendStatus(501);
});
app.post("/fail", (req, res) => {
    res.sendStatus(501);
});
app.post('/succ', (req, res) => {
    console.log("Logged in sucess");
    res.status(201).json({ userid: req.user }).send();
});
app.post('/signin', passport_1.default.authenticate('local', {
    successMessage: "Logged in Success",
    failureMessage: "Failed to login",
    failureRedirect: "/fail"
}), (req, res) => {
    res.status(201).json({ userid: req.user }).send();
});
app.put("/update/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.params.id;
    console.log(req.body);
    const data = req.body;
    yield documents_1.User.findByIdAndUpdate(userid, { boards: data })
        .then((resp) => {
        console.log(resp);
        req.logOut(() => console.log("error logging out"));
        res.sendStatus(201);
    })
        .catch((err) => {
        console.log(err);
        res.status(501).send();
    });
}));
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const board1 = { _id: Date.now() + Math.random() * 2, title: "To-do", cards: [] };
    const board2 = { _id: Date.now() + Math.random() * 2, title: "In-Progress", cards: [] };
    const board3 = { _id: Date.now() + Math.random() * 2, title: "Done", cards: [] };
    const name = req.body.username;
    const pass = req.body.password;
    const email = req.body.email;
    const image = null;
    yield documents_1.User.create({ email, password: pass, name, boards: [board1, board2, board3], image: image })
        .then((re) => {
        res.status(201).json({ userid: re.id });
    })
        .catch((err) => res.status(404).send());
}));
app.get("/getData/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.params.id;
    const data = yield documents_1.User.findOne({ _id: userid });
    res.status(201).json(data === null || data === void 0 ? void 0 : data.boards).send();
}));
app.post("/setImage/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.params.id;
    const url = req.body.url;
    yield documents_1.User.findByIdAndUpdate(uid, { image: url })
        .then((resp) => {
        res.sendStatus(201);
    }).catch((err) => {
        res.sendStatus(401);
    });
}));
app.get("/getImage/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.params.id;
    yield documents_1.User.findById(uid)
        .then(resp => res.status(201).json({ url: resp === null || resp === void 0 ? void 0 : resp.image }).send())
        .catch((err) => res.sendStatus(401));
}));
app.put('/updateUser/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.params.id;
    const { username, email, password } = req.body;
    console.log(req.body);
    yield documents_1.User.findByIdAndUpdate(uid, { name: username, email: email, password: password })
        .then((re) => {
        console.log(re);
        res.sendStatus(201);
    })
        .catch((err) => res.sendStatus(501));
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    mongoose_1.default.connect("mongodb+srv://labicons6:1tQCO5iQYOKQDNnS@cluster0.t1xpnv8.mongodb.net/?retryWrites=true&w=majority")
        .then((res) => console.log("Connection sucessfull"))
        .catch((err) => console.log("Error connecting DB........"));
});
