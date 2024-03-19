import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { userRouter } from "./routes/userRoutes";

const app = express();
app.use(cookieParser());
app.use(cors());

const port = process.env.PORT || 8000;

app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
