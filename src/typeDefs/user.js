import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    # Read your exact account (authenticated user)
    me: User @auth

    # Read a specific user that is logged in
    user(id: ID!): User @auth

    # Read all users that are logged in
    users: [User!]! @auth
  }

  extend type Mutation {
    # Call resolver for registering a new User through
    # @guest directive, @auth would lock people out
    signUp(email: String!, username: String!, name: String!, password: String!): User @guest

    # Call resolver for logging in registered User through
    # @guest directive, @auth would lock people out
    signIn(email: String!, password: String!): User @guest

    # Call resolver for logging out a User through @auth
    # directive, must be logged in to sign out
    signOut: Boolean @auth
  }

  type User {
    id: ID!             # Must have an id
    email: String!      # Must have an email
    username: String!   # Must have a username
    name: String!       # Must have a name
    songs: [Song!]!     # Must have an array of non-null songs or a non-null empty array
    createdAt: String!  # Must have a date of creation
    updatedAt: String!  # Must have a date of last update
  }
`