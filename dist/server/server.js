"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
class Server {
    constructor(port) {
        this.port = port;
        this.app = express();
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(bodyParser.json());
    }
    static init(port) {
        return new Server(port);
    }
    publicFolder() {
        const publicPath = path.resolve(__dirname, '../public');
        this.app.use(express.static(publicPath));
    }
    start(callback) {
        this.app.listen(this.port, callback);
        this.publicFolder();
    }
}
exports.default = Server;
