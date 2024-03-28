import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swagger from "./swagger.json";
import { userRouter } from "./routes/userRoutes";

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:8000/api-documentation",
      "https://users-api-r89w.onrender.com/api-documentation",
    ],
    credentials: true,
  })
);

const port = process.env.PORT || 8000;

app.use("/api-documentation", swaggerUi.serve, swaggerUi.setup(swagger));
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
