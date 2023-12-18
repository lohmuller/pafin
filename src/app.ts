import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import config from './config';

export const app = express();

app.use(bodyParser.json());
app.use(routes);

export const appServer = app.listen(config.server.port, () => {
    console.log(`Server is running on port ${config.server.port}`);
});