import Joi from '@hapi/joi'

const id = Joi
  .string()
  .alphanum()
  .min(24)
  .max(24)
  .required()
  .label('Id')

const title = Joi
  .string()
  .min(3)
  .max(30)
  .required()
  .label('Title')

const genre = Joi
  .string()
  .required()
  .label('Genre')

const creator = Joi
  .string()
  .alphanum()
  .min(24)
  .max(24)
  .label('Creator')

export const getProject = Joi
  .object()
  .keys({
    title,
    genre,
    creator
  })

export const createProject = Joi
  .object()
  .keys({
    title,
    genre,
    creator
  })

export const updateProject = Joi
  .object()
  .keys({
    id,
    title,
    genre
  })

export const deleteProject = Joi
  .object()
  .keys({
    id
  })
