import Joi from '@hapi/joi'

const id = Joi
  .string()
  .alphanum()
  .min(24)
  .max(24)
  .required()
  .label('Id')

const name = Joi
  .string()
  .min(3)
  .max(30)
  .required()
  .label('Name')

const type = Joi
  .string()
  .min(3)
  .max(30)
  .required()
  .label('Type')

const creator = Joi
  .string()
  .alphanum()
  .min(24)
  .max(24)
  .label('Creator')

export const readDevice = Joi
  .object()
  .keys({
    name,
    type,
    creator
  })

export const createDevice = Joi
  .object()
  .keys({
    name,
    type,
    creator
  })

export const updateDevice = Joi
  .object()
  .keys({
    id,
    name,
    type
  })

export const deleteDevice = Joi
  .object()
  .keys({
    id
  })
