import mongoose, { Schema } from 'mongoose'
import { hash, compare } from 'bcryptjs'

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
  songs: [{
    type: Schema.Types.ObjectId,
    ref: 'Song'
  }],
  name: String,
  password: String
}, {
  timestamps: true
})

// Anonymous function was used instead of arrow function,
// also used keyword 'this' in function body.

// If these functions fail, use function () and 'this'
// to fix them.

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
