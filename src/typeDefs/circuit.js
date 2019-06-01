import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    circuit(id: ID!): Circuit!
    circuits: [Circuit!]!
  }

  extend type Mutation {
    createCircuit(type: String!): Circuit @auth
    updateCircuit(id: ID!, type: String!): Circuit @auth
    connectToCircuit(srcId: ID!, destId: ID!): Circuit @auth
    disconnectFromCircuit(srcId: ID!, destId: ID!): Circuit @auth
    deleteCircuit(id: ID!): Boolean @auth
  }

  type Circuit {
    id: ID!
    type: String!
    inputs: [Circuit!]!
    outputs: [Circuit!]!
    device: Device!
    createdAt: String!
    updatedAt: String!
  }
`
