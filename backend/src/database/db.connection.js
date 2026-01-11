import mongoose from "mongoose";

export const connection = () => {
    mongoose.connect(process.env.DB_URI, {
        dbName: "MERN_AUTHENTICATION"
    }).then(() => {
        console.log("Database connected");
    }).catch((err) => {
        console.log("Database connection error", err);
    })
}