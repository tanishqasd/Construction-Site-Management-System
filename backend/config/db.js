const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });

        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.log("❌ Database Connection Failed");
        throw error;
    }
};

module.exports = connectDB;
