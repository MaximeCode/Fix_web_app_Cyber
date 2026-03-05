const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    collection: "users",
    minimize: false,
    versionKey: false,
  },
).set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;

    delete ret._id;
  },
});
Schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

Schema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
module.exports = Schema;
