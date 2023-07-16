const isProduction = process.env.ENVIRONMENT === 'production';
const host = isProduction
    ? `https://${process.env.WEBSERVER_HOST}`
    : `${process.env.WEBSERVER_PROTOCOL}://${process.env.WEBSERVER_HOST}:${process.env.WEBSERVER_PORT}`;

export default {
    isProduction,
    host,
};
