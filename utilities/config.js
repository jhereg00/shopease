// TODO: make this load from/save to external file
var config = {
  mongo: "shopease:#s3cuR!tY@localhost:27017/shopease",
  mongoTest: "test:testDB@localhost:27017/test",
  pwdSaltRounds: 10,
  env: process.env.NODE_ENV || 'production',
  port: process.env.PORT || 3002
}

module.exports = config;
