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

    // Bind body parser at the top, expect JSON
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

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

    // * Bind cookie-parser for handling CSRF
    app.use(cookieParser())

    // * Bind csurf for authenticating site access
    app.use(csrf({
      value: function (req) {
        return req.cookies['_csrf']
      }
    }))

    // * Bind error handler
    app.use((err, req, res, next) => {
      if (err.code !== 'EBADCSRFTOKEN') return next(err)
      res.status(403).json({
        'error': 'session expired or token tampered with'
      })
    })

    // * Bind function that updates CSRF on each action
    app.use(async (req, res, next) => {
      const token = await req.csrfToken()
      if (token !== 'null') {
        try {
          res.cookie('_csrf', token, {
            httpOnly: true,
            sameSite: 'strict'
          })
        } catch (err) {
          console.error(err)
        }
      }
      next()
    })

    // * Apollo Server instance
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

    // * Bind the middleware
    server.applyMiddleware({ app, cors: false })

    // * Start the server
    app.listen({ port: APP_PORT }, () =>
      console.log(`http://localhost:${APP_PORT}${server.graphqlPath}`)
    )
  } catch (err) {
    console.error(err)
  }
})()
