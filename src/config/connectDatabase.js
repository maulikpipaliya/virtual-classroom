import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
    console.log(`Connecting to database...`);
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
        });

        console.log(
            `[DBConnection] : SUCCESS. Connected to Database ${conn.connection.name}`
                .green
        );
    } catch (error) {
        console.error(`[DBConnection] : Error : ${error.message}`.red);
        // process.exit(1);
    }
};

export default connectDB;
