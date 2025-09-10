import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User";

dotenv.config();

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");

    const doctors = [
      {
        name: "Dr.Harshith Kumar",
        email: "n220737@rguktn.ac.in",
        role: "doctor",
        password: "hari@123", // plain, will be hashed by pre-save
      },
      {
        name: "Dr.Rakesh Royal",
        email: "n220788@rguktn.ac.in",
        role: "doctor",
        password: "rakhi@123",
      },
    ];

    for (const doc of doctors) {
      const exists = await User.findOne({ email: doc.email });
      if (!exists) {
        await User.create(doc); // let pre-save hash password
        console.log(`✅ Seeded: ${doc.name}`);
      } else {
        console.log(`⚠️ Already exists: ${doc.name}`);
      }
    }

    await mongoose.disconnect();
    console.log("🚀 Seeding finished.");
  } catch (err) {
    console.error("❌ Error seeding doctors:", err);
    process.exit(1);
  }
};

seedDoctors();
