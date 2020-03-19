module.exports = {
  postgresURI: process.env.POSTGRES_URI,
  baseURL: process.env.BASE_URL,
  secretOrKey: process.env.SECRET_OR_KEY,
  ssecretOrKeyRefresh: process.env.SECRET_OR_KEY_REFRESH,
  tokenDuration: 3600, // 1 hour
  refreshTokenDuration: 172800, // 2 days
  webSocket: process.env.WebSocket
};
