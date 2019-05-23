import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import csrf from 'csurf'
import express from 'express'
import session from 'express-session'
import connectRedis from 'connect-redis'
import { ApolloServer } from 'apollo-server-express'
import typeDefs from './typeDefs'
import resolvers from './resolvers'
import schemaDirectives from './directives'
import {
  APP_PORT,
  IN_PROD,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  SESS_NAME,
  SESS_SECRET,
  SESS_LIFETIME,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD
} from './config'

(async () => {
  try {
    // Attempt to connect to MongoDB
    await mongoose.connect(
      `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
      { useNewUrlParser: true }
    )

    // Create the instance of our app
    const app = express()

    // Prevent client-side JS from seeing "express"
    app.disable('x-powered-by')

    // Create the constructor for our data store
    const RedisStore = connectRedis(session)

    // Instantiate our data store
    const store = new RedisStore({
      host: REDIS_HOST,
      port: REDIS_PORT,
      pass: REDIS_PASSWORD
    })

    // Bind session to our app instance.
    app.use(session({
      /* Use Redis */
      store,

      /* Name of session */
      name: SESS_NAME,

      /* Signed secret */
      secret: SESS_SECRET,

      /* Force session to be saved back to Redis store */
      resave: true,

      /* Force session ID cookie to be set on every response */
      /* Also resets expiration to original maxAge (keeps cookie alive) */
      rolling: true,

      /* Comply with laws that require permission before setting a cookie */
      /* Also prevents race conditions caused by parallel requests */
      saveUninitialized: false,

      /* Session cookies */
      cookie: {
        /* Two hour maxAge */
        maxAge: parseInt(SESS_LIFETIME),

        /* Strict same site enforcement */
        sameSite: true,

        /* Lock down through HTTPS when deployed */
        secure: IN_PROD
      }
    }))

    // * Bind CSRF Token middleware to our session
    // * Bind function to append CSRF Token to every request
    // app.use(csrf())
    // app.use(async (req, res, next) => {
    //   const token = await req.csrfToken()
    //   if (token !== 'null') {
    //     try {
    //       res.locals.csrftoken = token
    //     } catch (err) {
    //       console.error(err)
    //     }
    //   }
    //   next()
    // })

    /**
     * NOTE: CSRF protection cannot be implemented without
     * a front end supplying the actual token upon each request.
     * Attempting to test the backend by itself without a
     * front end to supply the token back to the backend
     * will fail. This is not due to a failure of the
     * `csurf` package.
     * Only enable CSRF protection once the front end
     * is connected.
     */

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      schemaDirectives,
      playground: IN_PROD ? false : {
        settings: {
          'request.credentials': 'include'
        }
      },
      context: ({ req, res }) => ({ req, res })
    })

    const corsOptions = {
      origin: 'http://localhost:3000/',
      credentials: true
    }

    server.applyMiddleware({ app, cors: corsOptions })

    app.listen({ port: APP_PORT }, () =>
      console.log(`http://localhost:${APP_PORT}${server.graphqlPath}`)
    )
  } catch (err) {
    console.error(err)
  }
})()
