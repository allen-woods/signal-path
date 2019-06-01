import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    device(id: ID!): Device!
    devices: [Device!]!
  }

  extend type Mutation {
    createDevice(name: String!, type: String!): Device @auth
    updateDevice(id: ID!, name: String, type: String): Device @auth
    deleteDevice(id: ID!): Boolean @auth
  }

  type Device {
    id: ID!
    name: String!
    type: String!
    circuits: [Circuit!]!
    input: Entity
    output: Entity
    creator: User!
    createdAt: String!
    updatedAt: String!
  }
`
