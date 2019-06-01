import mongoose, { Schema } from 'mongoose'

const { ObjectId, Decimal128 } = Schema.Types

const entitySchema = new Schema({
  positionX: Decimal128,
  positionY: Decimal128,
  inputs: [{
    type: ObjectId,
    ref: 'Entity'
  }],
  outputs: [{
    type: ObjectId,
    ref: 'Entity'
  }],
  device: {
    type: ObjectId,
    ref: 'Device'
  },
  project: {
    type: ObjectId,
    ref: 'Project'
  }
}, {
  timestamps: true
})

const Entity = mongoose.model('Entity', entitySchema)

export default Entity
