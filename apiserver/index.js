import config from "config";
import app from "./app";

const server = app.listen(config.PORT, () => {
  const port = server.address().port;
  console.log(`App now running on port ${port}`);
});
