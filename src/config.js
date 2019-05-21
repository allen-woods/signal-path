// Export constants with default values
export const {
  /* Global to app */
  APP_PORT = 3000,
  NODE_ENV = 'development',

  /* MongoDB Specific */
  DB_USERNAME = 'admin',
  DB_PASSWORD = 'secret',
  DB_HOST = 'localhost',
  DB_PORT = 27017,
  DB_NAME = 'signal-path',

  /* Session Cookie Specific */
  SESS_NAME = 'sid',
  SESS_SECRET = 'ssh!secret!',
  SESS_LIFETIME = 1000 * 60 * 60 * 2,

  /* Redis Store Specific */
  REDIS_HOST = 'localhost',
  REDIS_PORT = 6379,
  REDIS_PASSWORD = 'secret'
} = process.env

// Truthy boolean coerced from NODE_ENV.
// This value is used to lock down app in 'production'.
export const IN_PROD = NODE_ENV === 'production'
