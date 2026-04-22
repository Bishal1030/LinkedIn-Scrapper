import express from "express";
import "dotenv/config";
import profileRoutes from "./routes/profile.route.js"
import cors from 'cors'

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true,
}));

app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
