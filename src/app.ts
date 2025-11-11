
import express, { Express } from "express";
import notFoundMiddleware from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";

import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import rateLimiter from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import { authRouter, orderRouter, productRouter, userRouter } from "./routes";
import { authenticatedUser } from "./middleware";

const app: Express = express();

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  }),
);
app.use(helmet());
app.use(cors());

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET_KEY));

app.use(express.static("./public"));
app.use(fileUpload());

// SwaggerUI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authenticatedUser, userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", authenticatedUser, orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandler);

export default app;
