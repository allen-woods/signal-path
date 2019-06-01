import Joi from '@hapi/joi'
import {
  createEntity,
  updateEntity,
  connectToEntity,
  disconnectFromEntity,
  deleteEntity,
  objectId
} from '../schemas'
import { Project, Entity } from '../models'

export default {
  Query: {
    entities: (project, args, context, info) => {
      return Entity.find({})
    },
    entity: async (project, args, context, info) => {
      await Joi.validate(args, objectId)
      return Entity.findById(args.id)
    }
  },
  Mutation: {
    createEntity: async (project, args, context, info) => {
      const { id } = project

      await Joi.validate(args, createEntity, { abortEarly: false })

      const createdEntity = await Entity.create(args)

      await Project.findByIdAndUpdate(id, {
        $push: {
          entities: createdEntity
        }
      }, {
        safe: true,
        upsert: true
      })

      return createdEntity
    },
    updateEntity: async (project, args, context, info) => {
      await Joi.validate(args, updateEntity, { abortEarly: false })
      const updatedEntity = await Entity.findByIdAndUpdate(args.id, args)
      return updatedEntity
    },
    connectToEntity: async (entity, args, context, info) => {
      // We need the Ids of both Entity objects
      // These will be passed in on args
      const { srcId, destId } = args

      // Find the Entity objects themselves
      const srcEntity = Entity.findById(srcId)
      const destEntity = Entity.findById(destId)

      // Validate
      await Joi.validate(args, connectToEntity, { abortEarly: false })

      // Only proceed if the Ids are different
      if (srcId !== destId) {
        // Push the src into the dest's inputs
        await Entity.findByIdAndUpdate(destId, {
          $push: {
            inputs: srcEntity
          }
        }, {
          safe: true,
          upsert: true
        })

        // Push the dest into the src's outputs
        await Entity.findByIdAndUpdate(srcId, {
          $push: {
            outputs: destEntity
          }
        }, {
          safe: true,
          upsert: true
        })

        // Return the dest Entity
        return destEntity
      }
    },
    disconnectFromEntity: async (entity, args, context, info) => {
      // We need the Ids of both Entity objects
      // These will be passed in on args
      const { srcId, destId } = args

      // Find the Entity objects themselves
      const srcEntity = Entity.findById(srcId)
      const destEntity = Entity.findById(destId)

      // Validate
      await Joi.validate(args, connectToEntity, { abortEarly: false })

      // Only proceed if the Ids are different
      if (srcId !== destId) {
        // Pull the src from the dest's inputs
        await Entity.findByIdAndUpdate(destId, {
          $pull: {
            inputs: srcEntity
          }
        }, {
          safe: true,
          upsert: true
        })

        // Pull the dest from the src's outputs
        await Entity.findByIdAndUpdate(srcId, {
          $pull: {
            outputs: destEntity
          }
        }, {
          safe: true,
          upsert: true
        })

        // Return the dest Entity
        return destEntity
      }
    },
    deleteEntity: async (project, args, context, info) => {
      // Extract the Project and Entity IDs
      const projectId = project.id
      const { id } = args

      // Validate the arguments
      await Joi.validate(args, deleteEntity, { abortEarly: false })

      // Extract the Entity to be removed
      const hostEntity = Entity.findById(id)

      // Iterate over inputs
      for (let i = 0; i < hostEntity.inputs.length; i++) {
        let inputId = hostEntity.inputs[i].id
        // Decouple reverse refs to removed Entity
        Entity.findByIdAndUpdate(inputId, {
          $pull: {
            outputs: id
          }
        }, {
          safe: true,
          upsert: true
        })
      }

      // Iterate over outputs
      for (let o = 0; o < hostEntity.outputs.length; o++) {
        let outputId = hostEntity.outputs[o].id
        // Decouple reverse refs to removed Entity
        Entity.findByIdAndUpdate(outputId, {
          $pull: {
            inputs: id
          }
        }, {
          safe: true,
          upsert: true
        })
      }

      // Extract exact project
      // Remove ref to removed Entity
      await Project.findByIdAndUpdate(projectId, {
        $pull: {
          entities: id
        }
      }, {
        safe: true,
        upsert: true
      })

      // Remove the Entity itself
      const deletedEntity = await Entity.findByIdAndRemove(id)

      return !!deletedEntity
    }
  },
  Entity: {
    inputs: async (entity, args, context, info) => {
      return (await entity.populate('inputs').execPopulate()).inputs
    },
    outputs: async (entity, args, context, info) => {
      return (await entity.populate('outputs').execPopulate()).outputs
    },
    device: async (entity, args, context, info) => {
      return (await entity.populate('device').execPopulate()).device
    },
    project: async (entity, args, context, info) => {
      return (await entity.populate('project').execPopulate()).project
    }
  }
}
