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

userSchema.pre('save', async () => {
  if (isModified('password')) {
    password = await hash(password, 10)
  }
})

userSchema.statics.notFound = async (options) => {
  return await where(options).countDocuments() === 0
}

userSchema.methods.matchesPassword = (passwordArg) => {
  return compare(passwordArg, password)
}

const User = mongoose.model('User', userSchema)

export default User