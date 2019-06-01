import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    entity(id: ID!): Entity!
    entities: [Entity!]!
  }

  extend type Mutation {
    createEntity(positionX: String!, positionY: String!): Entity @auth
    updateEntity(id: ID!, positionX: String, positionY: String): Entity @auth
    connectToEntity(srcId: ID!, destId: ID!): Entity @auth
    disconnectFromEntity(srcId: ID!, destId: ID!): Entity @auth
    deleteEntity(id: ID!): Boolean @auth
  }

  type Entity {
    id: ID!
    positionX: String!
    positionY: String!
    inputs: [Entity!]!
    outputs: [Entity!]!
    device: Device!
    project: Project!
    createdAt: String!
    updatedAt: String!
  }
`
