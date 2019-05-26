import Joi from '@hapi/joi'
import { signUp, signIn, objectId } from '../schemas'
import { attemptSignIn, signOut } from '../auth'
import { User } from '../models'

export default {
  // Extension of the Query type
  // (Read in CRUD)
  Query: {
    // Custom query of the authenticated User (self)
    me: (root, args, { req }, info) => {
      // TODO: projection
      // MongoDB callback methods for CRUD operations
      return User.findById(req.session.userId)
    },
    // Custom query of all users who have signed up
    users: (root, args, context, info) => {
      // TODO: projection, pagination
      // Pass an empty object so that all data returns
      return User.find({})
    },
    // Custom query for a specific user by Id
    user: async (root, args, context, info) => {
      // TODO: projection
      await Joi.validate(args, objectId)
      return User.findById(args.id)
    }
  },
  // Extension of the Mutation type
  // (Create, Update, Delete in CRUD)
  Mutation: {
    // Custom mutation for creating a new User
    signUp: async (root, args, { req }, info) => {
      // TODO: projection
      await Joi.validate(args, signUp, { abortEarly: false })
      // MongoDB callback function for Create
      const user = await User.create(args)
      // Create the 'sid' cookie using user.id
      req.session.userId = user.id
      // Return the created User
      return user
    },
    // Custom mutation for authenticating a User
    // (This technically isn't a CRUD action.)
    signIn: async (root, args, { req }, info) => {
      // TODO: projection
      await Joi.validate(args, signIn, { abortEarly: false })
      // Authenticate a user, handles error if it fails
      const user = await attemptSignIn(args.email, args.password)
      // Create the 'sid' cookie using user.id
      req.session.userId = user.id
      // Return the authenticated User
      return user
    },
    // Custom mutation for logging out the User
    signOut: (root, args, { req, res }, info) => {
      // Return the boolean of logout success
      return signOut(req, res)
    }
  },
  /**
   * Custom User type
   *
   * This is what will be extended to locate and retrieve
   * normalized data associated with a given User.
   */
  User: {
    projects: async (user, args, context, info) => {
      // TODO: should not be able to list other ppl's projects or read their project files!
      const outputTest = (await user.populate('projects').execPopulate()).projects
      return outputTest
    }
  }
}
