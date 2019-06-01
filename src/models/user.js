import mongoose, { Schema } from 'mongoose'
import { hash, compare } from 'bcryptjs'

const { ObjectId } = Schema.Types

const userSchema = new Schema({
  email: {
    type: String,
    validate: {
      validator: email => User.notFound({ email }),
      message: 'Email has already been taken.'
    }
  },
  username: {
    type: String,
    validate: {
      validator: username => User.notFound({ username }),
      message: 'Username has already been taken.'
    }
  },
  projects: [{
    type: ObjectId,
    ref: 'Project'
  }],
  name: String,
  password: String
}, {
  timestamps: true
})

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10)
  }
})

userSchema.statics.notFound = async function (options) {
  return await this.where(options).countDocuments() === 0
}

userSchema.methods.matchesPassword = function (password) {
  return compare(password, this.password)
}

const User = mongoose.model('User', userSchema)

export default User
