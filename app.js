const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config({
    path: './.env'
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API is running.' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
});
const db = require('./models');

const MAX_DB_CONNECT_RETRIES = parseInt(process.env.DB_RETRY_ATTEMPTS, 10) || 10;
const DB_RETRY_DELAY_MS = parseInt(process.env.DB_RETRY_DELAY_MS, 10) || 2000;

async function waitForDatabase() {
    let attempt = 0;

    while (attempt < MAX_DB_CONNECT_RETRIES) {
        try {
            await db.sequelize.authenticate();
            console.log('Database connection established');
            return;
        } catch (error) {
            attempt += 1;
            console.error(`Database connection attempt ${attempt}/${MAX_DB_CONNECT_RETRIES} failed:`, error.message);
            if (attempt >= MAX_DB_CONNECT_RETRIES) {
                throw error;
            }
            await new Promise((resolve) => setTimeout(resolve, DB_RETRY_DELAY_MS));
        }
    }
}

(async () => {
    try {
        await waitForDatabase();
        await db.sequelize.sync();
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (err) {
        console.error('Unable to sync database:', err);
        process.exit(1);
    }
})();
