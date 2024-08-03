import mongoose from "mongoose";

const getDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Successfully connected to the database");
  } catch (error) {
    console.error(error);
  }
};

export default getDB;
