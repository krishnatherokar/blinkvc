// load dotenv based on the ENVIRONMENT
if (process.env.NODE_ENV != "production") {
  // will return true if process.env.NODE_ENV is undefined (that's why we need dotenv)
  const dotenv = require("dotenv");
  dotenv.config();
}
