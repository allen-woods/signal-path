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

// entitySchema.pre('remove', async function () {
//   for (let i = 0; i < this.inputs.length; i++) {
//     let inputId = this.inputs[i]._id
//     Entity.findByIdAndUpdate(inputId, {
//       $pull: {
//         outputs: this._id
//       }
//     })
//   }

//   for (let o = 0; o < this.outputs.length; o++) {
//     let outputId = this.outputs[o]._id
//     Entity.findByIdAndUpdate(outputId, {
//       $pull: {
//         inputs: this._id
//       }
//     })
//   }
// })

const Entity = mongoose.model('Entity', entitySchema)

export default Entity
