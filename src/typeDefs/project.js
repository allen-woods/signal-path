import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    project(id: ID!): Project!
    projects: [Project!]!
  }

  extend type Mutation {
    createProject(title: String!, genre: String!): Project @auth
    updateProject(id: ID!, title: String, genre: String): Project @auth
    deleteProject(id: ID!): Boolean @auth
  }

  type Project {
    id: ID!
    title: String!
    genre: String!
    entities: [Entity!]!
    creator: User!
    collaborator: User # Ok to be null in case no one joins
    createdAt: String!
    updatedAt: String!
  }
`
