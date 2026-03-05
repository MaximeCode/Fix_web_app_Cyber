const UserModel = require("../models/user.js");
const jwt = require("jsonwebtoken");

const Login = class Login {
  /**
   * @constructor
   * @param {Object} app
   * @param {Object} config
   */
  constructor(app, connect, config) {
    this.app = app;
    this.UserModel = connect.model("User", UserModel);
    this.config = config;

    this.run();
  }

  auth() {
    this.app.get("/auth/", (req, res) => {
      try {
        const token = req.cookies.token;
        if (!token) {
          return res.status(401).json({ message: "No token provided" });
        }
        jwt.verify(token, this.config.jwtSecret, (err, decoded) => {
          if (err) {
            return res.status(401).json({ message: "Invalid token" });
          }
          res.status(200).json({ message: "Authenticated", user: decoded });
        });
      } catch (err) {
        console.error(`[ERROR] GET /auth/ -> ${err}`);
        res.status(500).json({
          code: 500,
          message: "Internal server error",
        });
      }
    });
  }

  getByLoginPassword() {
    console.log("getByLoginPassword()");
    this.app.post("/login/", async (req, res) => {
      console.log("POST /login/ route");
      try {
        const { login, password } = req.body;
        if (!login || !password) {
          return res
            .status(400)
            .json({ code: 400, message: "Login and password required" });
        }
        const user = await this.UserModel.findOne({ name: login });
        // console.log("User found:", user);
        if (!user || !(await user.comparePassword(password))) {
          // console.log("Invalid credentials for user:", login);
          return res
            .status(401)
            .json({ code: 401, message: "Invalid credentials" });
        }
        const token = jwt.sign(
          { id: user.id, name: user.name },
          this.config.jwtSecret,
          { expiresIn: "1h" },
        );
        // console.log("Token generated for user:", user.name);
        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          maxAge: 3600000,
        }); // secure: true in prod
        res.status(200).json({ code: 200, message: "Login successful", token });
        // console.log("Login successful, token issued", user.name);
      } catch (err) {
        console.error(`[ERROR] POST /login/ -> ${err}`);
        res.status(500).json({
          code: 500,
          message: "Internal server error",
        });
      }
    });
  }

  /**
   * Run
   */
  run() {
    this.auth();
    this.getByLoginPassword();
  }
};

module.exports = Login;
