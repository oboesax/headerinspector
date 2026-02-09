const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const app = require("./app");
const port = process.env.PORT === undefined ? 3000 : process.env.PORT;

app.listen(port, (error) => {
  if (error) {
    throw error;
  }
  console.log("server is up on port " + port);
});
