const { auth } = require("express-oauth2-jwt-bearer");

const jwtCheck = auth({
  audience: process.env.REACT_APP_AUDIENCE,
  issuerBaseURL: process.env.REACT_APP_ISSUER_BASE_URL,
});

module.exports = jwtCheck;
