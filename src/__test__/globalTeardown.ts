import { app, appServer } from '../app';

module.exports = async () => {
    appServer.close();
    process.exit(0);
};