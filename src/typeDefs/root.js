import { gql } from 'apollo-server-express'

/**
 * We first apply directives that give preference to
 * authenticated users over guests.
 * 
 * The underscores in the root definitions is a work-
 * around for a lack of support for dynamic type casting
 * in the GraphQL standard. This will change in the future.
 */

export default gql`
  directive @auth on FIELD_DEFINITION
  directive @guest on FIELD_DEFINITION

  type Query {
    _: String
  }

  type Mutation {
    _: String
  }

  type Subscription {
    _: String
  }
`
