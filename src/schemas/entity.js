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

const positionX = Joi
  .string()
  .required()
  .label('Position-X')

const positionY = Joi
  .string()
  .required()
  .label('Position-Y')

const device = Joi
  .string()
  .alphanum()
  .min(24)
  .max(24)
  .required()
  .label('Device')

const project = Joi
  .string()
  .alphanum()
  .min(24)
  .max(24)
  .required()
  .label('Project')

export const readEntity = Joi
  .object()
  .keys({
    positionX,
    positionY,
    device,
    project
  })

export const createEntity = Joi
  .object()
  .keys({
    positionX,
    positionY,
    device,
    project
  })

export const updateEntity = Joi
  .object()
  .keys({
    id,
    positionX,
    positionY,
    device
  })

export const connectToEntity = Joi
  .object()
  .keys({
    srcId,
    destId
  })

export const disconnectFromEntity = Joi
  .object()
  .keys({
    srcId,
    destId
  })

export const deleteEntity = Joi
  .object()
  .keys({
    id
  })
