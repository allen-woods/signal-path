import Joi from '@hapi/joi'
import {
  createProject,
  updateProject,
  deleteProject,
  objectId
} from '../schemas'
import { User, Project } from '../models'

export default {
  Query: {
    projects: (root, args, { req }, info) => {
      return Project.find({})
    },
    project: async (root, args, context, info) => {
      await Joi.validate(args, objectId)
      return Project.findById(args.id)
    }
  },
  Mutation: {
    createProject: async (root, args, { req }, info) => {
      const { userId } = req.session
      const { title, genre } = args

      await Joi.validate(args, createProject, { abortEarly: false })

      const createdProject = await Project.create({ title, genre, creator: userId })

      await User.findByIdAndUpdate(userId, {
        $push: {
          projects: createdProject
        }
      }, {
        safe: true,
        upsert: true
      })

      return createdProject
    },
    updateProject: async (root, args, context, info) => {
      await Joi.validate(args, updateProject, { abortEarly: false })
      const updatedProject = await Project.findByIdAndUpdate(args.id, args)
      return updatedProject
    },
    deleteProject: async (root, args, { req }, info) => {
      const { userId } = req.session
      const { id } = args

      await Joi.validate(args, deleteProject, { abortEarly: false })

      const deletedProject = await Project.findByIdAndRemove(id)

      await User.findByIdAndUpdate(userId, {
        $pull: {
          projects: id
        }
      }, {
        safe: true,
        upsert: true
      })

      return !!deletedProject
    }
  },
  /**
   * Custom Project Type
   *
   * This is what will be extended to locate and retrieve
   * normalized data associated with a given Project.
   */
  Project: {
    creator: async (project, args, { req }, info) => {
      return (await project.populate('creator').execPopulate()).creator
    }
  }
}
