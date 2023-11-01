"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cards = exports.Board = exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    boards: [
        {}
    ],
    image: String
});
const boardSchema = new mongoose_1.Schema({
    title: String,
    cards: [{}]
});
const cardSchema = new mongoose_1.Schema({
    title: String,
    labels: {
        type: {}
    },
    date: Date,
    desc: { type: String },
    tasks: [
        {}
    ]
});
exports.User = (0, mongoose_1.model)('user', userSchema);
exports.Board = (0, mongoose_1.model)('boards', boardSchema);
exports.Cards = (0, mongoose_1.model)('cards', cardSchema);
