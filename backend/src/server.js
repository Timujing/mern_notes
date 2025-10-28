import express from 'express';
import notesRouter from './routes/notesRoutes.js';
import authRouter from './routes/authRoutes.js';
import connect from './config/connect_db.js'
import rateLimitMiddleware from './middleware/rateLimiter.js';
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/errorHandler.js';
import authMiddleware from './middleware/authMiddleware.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const PORT = process.env.PORT || 8000;

const app = express();

// give access origin to make requests. Should be first, then rateLimit
if (process.env.NODE_ENV !== "production") {
    app.use(
      cors({
        origin: "http://localhost:5173",
      })
    );
}

// parsing req.body with json payloads
app.use(express.json());
// parsing req.cookies with cookie parser https://github.com/expressjs/cookie-parser#readme
app.use(cookieParser());
// rate limiter middleware
app.use(rateLimitMiddleware);

app.use('/api/auth', authRouter);
app.use('/api/notes', authMiddleware, notesRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const startServer = async () => {
    try {
        
        // connecting to our mongo db
        await connect(process.env.MONGO_URL);
        
        app.listen(PORT, () => {
            console.log(`server running on port: ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

startServer();