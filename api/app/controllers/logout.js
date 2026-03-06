const { remove } = require("../models/contact");

const Logout = class Logout {
    constructor(app) {
        this.app = app;
        this.run();
    }

    removeCookie() {
        this.app.post("/logout/", async (req, res) => {
            try {
                res.clearCookie("token");
                res.status(200).json({ message: "Logged out" });
            } catch (err) {
                console.error(`[ERROR] POST /logout/ -> ${err}`);
                res.status(500).json({
                    code: 500,
                    message: "Internal server error",
                });
            }
        });
    }

    run() {
        this.removeCookie();
    }
};

module.exports = Logout;