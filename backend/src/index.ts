import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/connectDB";
import bodyParser from 'body-parser'
import cookieParser from "cookie-parser";
import userRoute from './routes/user.route'
import restaurantRoute from './routes/restaurnat.route'
import menuRoute from './routes/menu.routes'
import orderRoute from './routes/order.route'
import cors from 'cors'

dotenv.config();
const app = express()

const PORT = process.env.PORT || 3000;

// app.use(bodyParser.json({ limit: '10mb'}));
app.use(express.urlencoded({ extended: true, limit: '10mb'}));
app.use(express.json());
app.use(cookieParser());

const corsOption = {
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true
}
app.use(cors(corsOption));

// api
app.use("/api/v1/user", userRoute)
app.use("/api/v1/restaurant", restaurantRoute)
app.use("api/v1/menu", menuRoute)
app.use("/api/v1/order", orderRoute);

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server listen at port ${PORT}`);
});