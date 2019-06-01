import Joi from '@hapi/joi'
import {
  createDevice,
  updateDevice,
  deleteDevice,
  objectId
} from '../schemas'
import { User, Device } from '../models'

export default {
  Query: {
    devices: (root, args, context, info) => {
      return Device.find({})
    },
    device: async (root, args, context, info) => {
      await Joi.validate(args, objectId)
      return Device.findById(args.id)
    }
  },
  Mutation: {
    createDevice: async (root, args, { req }, info) => {
      const { userId } = req.session
      const { name, type } = args

      await Joi.validate(args, createDevice, { abortEarly: false })

      const createdDevice = await Device.create({ name, type, creator: userId })

      await User.findByIdAndUpdate(userId, {
        $push: {
          devices: createdDevice
        }
      }, {
        safe: true,
        upsert: true
      })

      return createdDevice
    },
    updateDevice: async (root, args, context, info) => {
      await Joi.validate(args, updateDevice, { abortEarly: false })
      const updatedDevice = await Device.findByIdAndUpdate(args.id, args)
      return updatedDevice
    },
    deleteDevice: async (root, args, { req }, info) => {
      const { userId } = req.session
      const { id } = args

      await Joi.validate(args, deleteDevice, { abortEarly: false })

      const deletedDevice = await Device.findByIdAndRemove(id)

      await User.findByIdAndUpdate(userId, {
        $pull: {
          devices: id
        }
      }, {
        safe: true,
        upsert: true
      })

      return !!deletedDevice
    }
  },
  Device: {
    circuits: async (device, args, context, info) => {
      return (await device.populate('circuits').execPopulate()).circuits
    },
    creator: async (device, args, context, info) => {
      return (await device.populate('creator').execPopulate()).creator
    }
  }
}
