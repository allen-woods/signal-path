import mongoose, { Schema } from 'mongoose'

const { ObjectId } = Schema.Types

const circuitSchema = new Schema({
  type: String,
  inputs: [{
    type: ObjectId,
    ref: 'Circuit'
  }],
  outputs: [{
    type: ObjectId,
    ref: 'Circuit'
  }],
  device: {
    type: ObjectId,
    ref: 'Device'
  }
}, {
  timestamps: true
})

const Circuit = mongoose.model('Circuit', circuitSchema)

export default Circuit
