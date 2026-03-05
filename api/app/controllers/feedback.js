const FeedbackModel = require('../models/feedback.js')
const authMiddleware = require('../middleware/auth.js')
const Joi = require('joi')

const Feedback = class Feedback {
  /**
   * @constructor
   * @param {Object} app
   * @param {Object} config
   */
  constructor(app, connect, config) {
    this.app = app
    this.FeedbackModel = connect.model('Feedback', FeedbackModel)
    this.config = config

    this.run()
  }

  /**
   * Middleware
   */
  create() {
    this.app.post('/feedback/', (req, res) => {
      console.log(req.body);
      try {
        const schema = Joi.object({
          name: Joi.string().required(),
          message: Joi.string().required()
        });
        const { error } = schema.validate(req.body);
        if (error) {
          return res.status(400).json({ code: 400, message: error.details[0].message });
        }
        const feedbackModel = new this.FeedbackModel(req.body);

        feedbackModel.save().then((feedback) => {
          res.status(200).json(feedback || {})
        }).catch(() => {
          res.status(403).json({
            code: 403,
            message: 'Bad request'
          })
        })
      } catch (err) {
        console.error(`[ERROR] POST feedbacks/ -> ${err}`)

        res.status(500).json({
          code: 500,
          message: 'Internal server error'
        })
      }
    })
  }

  /**
 * Middleware
 */
  all() {
    this.app.get('/feedback/', authMiddleware(this.config), (req, res) => {
      try {
        this.FeedbackModel.find().sort({ createdAt: -1 }).then((feedback) => {
          res.status(200).json(feedback || {})
        }).catch(() => {
          res.status(403).json({
            code: 403,
            message: 'Bad request'
          })
        })
      } catch (err) {
        console.error(`[ERROR] POST feedbacks/ -> ${err}`)

        res.status(500).json({
          code: 500,
          message: 'Internal server error'
        })
      }
    })
  }

  delete() {
    this.app.delete('/feedback/:id', authMiddleware(this.config), (req, res) => {
      try {
        this.FeedbackModel.findByIdAndDelete(req.params.id).then((feedback) => {
          res.status(200).json(feedback || {})
        }).catch(() => {
          res.status(403).json({
            code: 403,
            message: 'Bad request'
          })
        })
      } catch (err) {
        console.error(`[ERROR] POST feedbacks/ -> ${err}`)

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

module.exports = Feedback
