import * as dotenv from 'dotenv'
dotenv.config()

import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'
import { Collection } from 'mongodb'

import grpc from 'grpc'

// SERVIDOR MONGO
const uri = process.env.MONGO_URI || ''
const database = process.env.DB_NAME || 'sample_mflix'
const table = process.env.COLLECTION_NAME || 'movies'

let db
let collections: Collection

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function connectMongo() {
  try {
    await client.connect()
    db = client.db(database)
    collections = db.collection(table)
  } catch (error) {
    console.log('error mongo', error)
  }
}

connectMongo().then(() => {
  const maxMessageSize = 1024 * 1024 * 1024

  const serverOptions = {
    'grpc.max_message_length': maxMessageSize,
    'grpc.max_receive_message_length': maxMessageSize,
    'grpc.max_send_message_length': maxMessageSize,
  }

  const server = new grpc.Server(serverOptions)

  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure())
  server.start()
  console.log('Server started on port :50051')
})
