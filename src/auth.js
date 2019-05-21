import { AuthenticationError } from 'apollo-server-express'
import { User } from './models'
import { SESS_NAME } from './config'

export const attemptSignIn = async (email, password) => {
  // Generic error message
  const message = 'Incorrect email or password. Please try again.'
  // Look for the user by email
  const user = await User.findOne({ email })
  // If the user does not exist by email or password
  if (!user || !await user.matchesPassword(password)) {
    // Throw a new error with the generic message
    throw new AuthenticationError(message)
  }
  // If everything went well, return the user
  return user
}

// signedIn is truthy if userId exists,
// signedIn is falsy if userId does not exist.
const signedIn = (req) => req.session.userId

// Make sure we can't access things that require login.
export const ensureSignedIn = (req) => {
  // We check signedIn by coercing it to a boolean
  if (!signedIn(req)) {
    throw new AuthenticationError('You must be signed in.')
  }
}

// Prevent breaking the app if we try to sign in twice.
export const ensureSignedOut = (req) => {
  // We check signedIn by coercing it to a boolean
  if (signedIn(req)) {
    throw new AuthenticationError('You are already signed in.')
  }
}

// Handle signing out of the app.
export const signOut = (req, res) => Promise(
  (resolve, reject) => {
    // Attempt to destroy the Session
    req.session.destroy(err => {
      // If there is an error, reject the Promise
      if (err) reject(err)
      // If there is no error, clear the Cookie
      res.clearCookie(SESS_NAME)
      // Resolve the Promise
      resolve(true)
    })
  }
)