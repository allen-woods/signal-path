import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import csrf from 'csurf'
import bodyParser from 'body-parser'
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
      store,                            /* Use Redis */
      name: SESS_NAME,                  /* Name of session */
      secret: SESS_SECRET,              /* Signed secret */
      resave: true,                     /* Force session to be saved back to Redis store */
      rolling: true,                    /* Force session ID cookie to be set on every response */
                                        /* Also resets expiration to original maxAge (keeps cookie alive) */

      saveUninitialized: false,         /* Comply with laws that require permission before setting a cookie */
                                        /* Also prevents race conditions caused by parallel requests */

      cookie: {                         /* Session cookies */
        maxAge: parseInt(SESS_LIFETIME),/* Two hour maxAge */
        sameSite: true,                 /* Strict same site enforcement */
        secure: IN_PROD                 /* Lock down through HTTPS when deployed */
      }
    }))

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

    server.applyMiddleware({ app, cors: false })

    app.listen({ port: APP_PORT }, () =>
      console.log(`http://localhost:${APP_PORT}${server.graphqlPath}`)
    )
  } catch (err) {
    console.error(err)
  }
})()

/*
import cookieParser from 'cookie-parser'
import csrf from 'csurf'
import bodyParser from 'body-parser'
import express from 'express'

// setup route middlewares
const csrfProtection = csrf({ cookie: true })
const parseForm = bodyParser.urlencoded({ extended: false })

// create express app
const app = express()

// parse cookies
// we need this because "cookie" is true in csrfProtection
app.use(cookieParser())

app.get('/form', csrfProtection, (req, res) => {
  // pass the csrfToken to the view
  res.render('send', { csrfToken: req.csrfToken() })
})

app.post('/process', parseForm, csrfProtection, (req, res) => {
  res.send('data is being processed')
})*/