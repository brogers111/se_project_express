const config = {
  JWT_SECRET: process.env.JWT_SECRET,
  DB_URI: process.env.DB_URI,
  PORT: process.env.PORT || 3001,
};

module.exports = config;
