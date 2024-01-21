const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://chitniskanika:EcSnrFQDrajlU1MJ@users.wocwsgi.mongodb.net/?retryWrites=true&w=majority");
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection error:", error.message);
    }
};

const UserSchema = new mongoose.Schema({
    userID: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: Buffer
    }
});

const User = mongoose.model("users", UserSchema);

module.exports = { connectDB, User };
