import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URL || "mongodb://localhost:27017";
const dbName = process.env.MONGODB_DB_NAME || "chatleaf_app";
const collectionName = "shopify_sessions";

let client;

export const connectToMongoDB = async () => {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB for session storage");
  }
  return client.db(dbName).collection(collectionName);
};
