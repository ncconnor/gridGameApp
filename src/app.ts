import express from 'express';
import { GameService } from './services/game.service';
import createRouter from './routes';

const app = express();

// create/inject the GameService instance
const gameService = new GameService();

app.use(express.json());
app.use('/api', createRouter(gameService));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;