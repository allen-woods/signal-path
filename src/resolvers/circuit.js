import Joi from '@hapi/joi'
import {
  createCircuit,
  updateCircuit,
  connectToCircuit,
  disconnectFromCircuit,
  deleteCircuit,
  objectId
} from '../schemas'
import { Device, Circuit } from '../models'

export default {
  Query: {
    circuits: (device, args, context, info) => {
      return Circuit.find({})
    },
    circuit: async (device, args, context, info) => {
      await Joi.validate(args, objectId)
      return Circuit.findById(args.id)
    }
  },
  Mutation: {
    createCircuit: async (device, args, context, info) => {
      const { id } = device

      await Joi.validate(args, createCircuit, { abortEarly: false })

      const createdCircuit = await Circuit.create(args)

      await Device.findByIdAndUpdate(id, {
        $push: {
          circuits: createdCircuit
        }
      }, {
        safe: true,
        upsert: true
      })

      return createdCircuit
    },
    updateCircuit: async (device, args, context, info) => {
      await Joi.validate(args, updateCircuit, { abortEarly: false })
      const updatedCircuit = await Circuit.findByIdAndUpdate(args.id, args)
      return updatedCircuit
    },
    connectToCircuit: async (circuit, args, context, info) => {
      const { srcId, destId } = args

      const srcCircuit = Circuit.findById(srcId)
      const destCircuit = Circuit.findById(destId)

      await Joi.validate(args, connectToCircuit, { abortEarly: false })

      if (srcId !== destId) {
        await Circuit.findByIdAndUpdate(destId, {
          $push: {
            inputs: srcCircuit
          }
        }, {
          safe: true,
          upsert: true
        })

        await Circuit.findByIdAndUpdate(srcId, {
          $push: {
            outputs: destCircuit
          }
        }, {
          safe: true,
          upsert: true
        })

        return destCircuit
      }
    },
    disconnectFromCircuit: async (circuit, args, context, info) => {
      const { srcId, destId } = args

      const srcCircuit = Circuit.findById(srcId)
      const destCircuit = Circuit.findById(destId)

      await Joi.validate(args, disconnectFromCircuit, { abortEarly: false })

      if (srcId !== destId) {
        await Circuit.findByIdAndUpdate(destId, {
          $pull: {
            inputs: srcCircuit
          }
        }, {
          safe: true,
          upsert: true
        })

        await Circuit.findByIdAndUpdate(srcId, {
          $pull: {
            outputs: destCircuit
          }
        }, {
          safe: true,
          upsert: true
        })

        return destCircuit
      }
    },
    deleteCircuit: async (device, args, context, info) {
      const deviceId = device.id
      const { id } = args

      await Joi.validate(args, deleteCircuit, { abortEarly: false })

      const hostCircuit = Circuit.findById(id)

      for (let i = 0; i < hostCircuit.inputs.length; i++) {
        let inputId = hostCircuit.inputs[i].id
        await Circuit.findByIdAndUpdate(inputId, {
          $pull: {
            outputs: id
          }
        }, {
          safe: true,
          upsert: true
        })
      }

      for (let o = 0; o < hostCircuit.inputs.length; o++) {
        let outputId = hostEntity.outputs[o].id
        await Circuit.findByIdAndUpdate(outputId, {
          $pull: {
            inputs: id
          }
        }, {
          safe: true,
          upsert: true
        })
      }

      await Device.findByIdAndUpdate(deviceId, {
        $pull: {
          circuits: id
        }
      }, {
        safe: true,
        upsert: true
      })

      const deletedCircuit = await Circuit.findByIdAndRemove(id)

      return !!deletedCircuit
    }
  },
  Circuit: {
    inputs: async (circuit, args, context, info) => {
      return (await circuit.populate('inputs').execPopulate()).inputs
    },
    outputs: async (circuit, args, context, info) => {
      return (await circuit.populate('outputs').execPopulate()).outputs
    },
    device: async (circuit, args, context, info) => {
      return (await circuit.populate('device').execPopulate()).device
    }
  }
}
