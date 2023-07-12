require('dotenv').config();
export const port = process.env.PORT || 8080;

export const Info = {
  name: 'Prison Management API',
  version: '1.0.0',
  origin: 'http://localhost:4002',
  accessTokenExpiresIn: 15,
  refreshTokenExpiresIn: 60,
  redisCacheExpiresIn: 60,
};
