const path = require("path");
require('dotenv').config({ path: path.join(__dirname, '../', '.env') })
module.exports = {
  HOST: process.env.HOST,
  SDK_PORT: process.env.SDK_PORT,
  DISCOVERY_AS_LOCALHOST: process.env.DISCOVERY_AS_LOCALHOST,
 }
