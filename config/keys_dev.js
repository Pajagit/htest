module.exports = {
  postgresURI: "postgres://postgres:postgres@localhost:5432/htest",
  baseURL: "http://localhost:3000/",
  secretOrKey: "interviewSecret",
  secretOrKeyRefresh: "refreshKey",
  tokenDuration: 3600, // 1 hour
  refreshTokenDuration: 172800, // 2 days
  webSocket: "http://localhost:4000/"
};
