import mongoose, { Schema } from 'mongoose'

const { ObjectId } = Schema.Types

const projectSchema = new Schema({
  title: String,
  genre: String,
  creator: {
    type: ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

// pre / post hooks, statics, and methods go here

const Project = mongoose.model('Project', projectSchema)

export default Project
