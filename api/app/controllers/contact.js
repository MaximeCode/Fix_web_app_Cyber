const ContactModel = require('../models/contact.js')
const authMiddleware = require('../middleware/auth.js')
const Joi = require('joi')

const Contact = class Contact {
  /**
   * @constructor
   * @param {Object} app
   * @param {Object} config
   */
  constructor(app, connect, config) {
    this.app = app
    this.ContactModel = connect.model('Contact', ContactModel)
    this.config = config

    this.run()
  }

  create() {
    this.app.post('/contact/', (req, res) => {
      try {
        const schema = Joi.object({
          firstName: Joi.string().required(),
          lastName: Joi.string().required(),
          mobilePhone: Joi.string().pattern(/^0[6|7]{1}([0-9]{2}){4}$/).required(),
          email: Joi.string().email().required(),
          arrivedAt: Joi.date().required(),
          departureAt: Joi.date().required(),
          message: Joi.string().required()
        });
        const { error } = schema.validate(req.body);
        if (error) {
          return res.status(400).json({ code: 400, message: error.details[0].message });
        }
        const contactModel = new this.ContactModel(req.body);

        contactModel.save().then((contact) => {
          res.status(200).json(contact || {})
        }).catch(() => {
          res.status(403).json({
            code: 403,
            message: 'Bad request'
          })
        })
      } catch (err) {
        console.error(`[ERROR] POST contacts/ -> ${err}`)

        res.status(500).json({
          code: 500,
          message: 'Internal server error'
        })
      }
    })
  }

  all() {
    this.app.get('/contacts/', authMiddleware(this.config), (req, res) => {
      try {
        this.ContactModel.find().sort({ createdAt: -1 }).then((contact) => {
          res.status(200).json(contact || {})
        }).catch(() => {
          res.status(403).json({
            code: 403,
            message: 'Bad request'
          })
        })
      } catch (err) {
        console.error(`[ERROR] POST contacts/ -> ${err}`)

        res.status(500).json({
          code: 500,
          message: 'Internal server error'
        })
      }
    })
  }

  delete() {
    this.app.delete('/contact/:id', authMiddleware(this.config), (req, res) => {
      try {
        // console.log(req.params);
        this.ContactModel.findByIdAndDelete(req.params.id).then((contact) => {
          res.status(200).json(contact || {})
        }).catch(() => {
          res.status(403).json({
            code: 403,
            message: 'Bad request'
          })
        })
      } catch (err) {
        console.error(`[ERROR] POST contacts/ -> ${err}`)

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
  run() {
    this.delete()
    this.all()
    this.create()
  }
}

module.exports = Contact
