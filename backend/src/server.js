import express from 'express';
import router from './routes/notesRoutes.js';
import connect from './db/connect.js'
const PORT = process.env.PORT || 8000;

const app = express();

// parsing req.body
app.use(express.json());

app.use('/api/notes', router);

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