import "dotenv/config";
import { app } from "./app.js";
import connectDB from "./db/index.js";

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is up and running at Port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Mongodb connection error", err);
  });
