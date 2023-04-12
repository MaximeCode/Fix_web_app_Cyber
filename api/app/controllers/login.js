const UserModel = require('../models/user.js')

const Login = class Login {
  /**
   * @constructor
   * @param {Object} app
   * @param {Object} config
   */
  constructor (app, connect) {
    this.app = app
    this.UserModel = connect.model('User', UserModel)

    this.run()
  }

  auth() {
    this.app.get('/auth/', (req, res) => {
      try {
        res.status(200).json({ 'message': 'ok' })
      } catch (err) {
        console.error(`[ERROR] POST logins/ -> ${err}`)
  
        res.status(500).json({
          code: 500,
          message: 'Internal server error'
        })
      }
    })
  }

  getByLoginPassword () {
    this.app.get('/login/', (req, res) => {
      try {
        res.status(200).json({ code: 200, message: 'ok' });
      } catch (err) {
        console.error(`[ERROR] POST logins/ -> ${err}`)
  
        res.status(500).json({
          code: 500,
          message: 'Internal server error'
        })
      }
    })
  }

  /**
   * Run
   */
  run () {
    this.auth()
    this.getByLoginPassword()
  }
}

module.exports = Login
