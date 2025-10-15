import express from 'express';
import router from './routes/notesRoutes.js';
import connect from './config/connect_db.js'
import rateLimitMiddleware from './middleware/rateLimiter.js';
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/errorHandler.js';
import cors from 'cors';
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
// rate limiter middleware
app.use(rateLimitMiddleware);

app.use('/api/notes', router);

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