const app = require("./app");
const port = process.env.PORT === undefined ? 3050 : process.env.PORT;

app.listen(port, () => {
  console.log("server is up on port " + port);
});
