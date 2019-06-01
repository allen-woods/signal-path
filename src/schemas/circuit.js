import Joi from '@hapi/joi'

const id = Joi
  .string()
  .alphanum()
  .min(24)
  .max(24)
  .required()
  .label('Id')

const srcId = Joi
  .string()
  .alphanum()
  .min(24)
  .max(24)
  .required()
  .label('SourceId')

const destId = Joi
  .string()
  .alphanum()
  .min(24)
  .max(24)
  .required()
  .label('DestinationId')

const type = Joi
  .string()
  .alphanum()
  .min(3)
  .max(100)
  .required()
  .label('Type')

const device = Joi
  .string()
  .alphanum()
  .min(24)
  .max(24)
  .required()
  .label('Device')

export const readCircuit = Joi
  .object()
  .keys({
    type,
    device
  })

export const createCircuit = Joi
  .object()
  .keys({
    type,
    device
  })

export const updateCircuit = Joi
  .object()
  .keys({
    type,
    device
  })

export const connectToCircuit = Joi
  .object()
  .keys({
    srcId,
    destId
  })

export const disconnectFromCircuit = Joi
  .object()
  .keys({
    srcId,
    destId
  })

export const deleteCircuit = Joi
  .object()
  .keys({
    id
  })
