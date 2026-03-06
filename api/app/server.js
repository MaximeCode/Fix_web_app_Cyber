// Dependencies
const express = require("express");
const mongoose = require("mongoose");

// Dependencies middleware
const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

// Core
const config = require("./config.js");
const routes = require("./controllers/routes.js");

/**
 * Server
 */
module.exports = class Server {
  constructor() {
    this.app = express();
    this.config = config[process.argv[2]] || config.development;
  }

  /*
   * db connect
   * @return {Object} connect
   */
  dbConnect() {
    const host = this.config.mongodb;
    const connect = mongoose.createConnection(host);

    connect.on("error", (err) => {
      setTimeout(() => {
        console.log("[ERROR] users api dbConnect() -> mongodb error");
        this.connect = this.dbConnect(host);
      }, 5000);

      console.error(`[ERROR] users api dbConnect() -> ${err}`);
    });

    connect.on("disconnected", (err) => {
      setTimeout(() => {
        console.log(
          "[DISCONNECTED] users api dbConnect() -> mongodb disconnected",
        );
        this.connect = this.dbConnect(host);
      }, 5000);
    });

    process.on("SIGINT", () => {
      connect.close(() => {
        console.log(
          "[API END PROCESS] users api dbConnect() -> close mongodb connection",
        );
        process.exit(0);
      });
    });

    return connect;
  }

  /**
   * Middleware
   */
  middleware() {
    this.app.use(helmet());
    this.app.use(cors({ origin: 'http://127.0.0.1:9090', credentials: true }));
    this.app.use(cookieParser());
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    });
    this.app.use(limiter);
    this.app.use(compression());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }

  /**
   * Routes
   */
  routes() {
    new routes.Login(this.app, this.connect, this.config);
    new routes.Contact(this.app, this.connect, this.config);
    new routes.Feedback(this.app, this.connect, this.config);
    new routes.Logout(this.app, this.connect, this.config);

    // If route not exist
    this.app.use((req, res) => {
      res.status(404).json({
        code: 404,
        message: "Not Found",
      });
    });
  }

  /**
   * Run
   */
  run() {
    try {
      console.log(`[INFO] Server -> Starting server in ${this.config.type} mode...`);
      this.connect = this.dbConnect();
      this.middleware();
      this.routes();
      this.app.listen(this.config.port);
      console.log(`[INFO] Server -> Server is running on port ${this.config.port}`);
    } catch (err) {
      console.error(`[ERROR] Server -> ${err}`);
    }
  }
};
