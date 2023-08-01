"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../src/index"));
const mailer = new index_1.default({
    config: "main"
});
mailer.sendMail(["example@gmail.com"], 'Hello, World!', 'Hellooooooooo');
