import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI!;
  await mongoose.connect(uri, { writeConcern: { w: "majority" } });
  console.log("MongoDB connected");
};

export default connectDB;
