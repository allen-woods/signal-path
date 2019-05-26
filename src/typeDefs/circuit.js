import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    audioComponent(id: ID!): audioComponent @auth
    audioComponents: [AudioComponent!]! @auth
  }

  extend type Mutation {
    addAudioComponent()
    updateAudioComponent()
    deleteAudioComponent()
  }
`
