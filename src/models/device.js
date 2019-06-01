import mongoose, { Schema } from 'mongoose'

const { ObjectId } = Schema.Types

const deviceSchema = new Schema({
  name: String,
  type: String,
  circuits: [{
    type: ObjectId,
    ref: 'Circuit'
  }],
  input: {
    type: ObjectId,
    ref: 'Entity'
  },
  output: {
    type: ObjectId,
    ref: 'Entity'
  },
  creator: {
    type: ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

const Device = mongoose.model('Device', deviceSchema)

export default Device
