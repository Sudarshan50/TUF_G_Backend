import e from "express";
import dotenv from "dotenv";
import db from "./config/db.js";
import errorHandler from "./middleware/errorMiddleware.js";
import passRoutes from "./routes/passRoutes.js";
import appRoutes from "./routes/appRoutes.js";
dotenv.config();

const port = process.env.PORT || 4000;

const app = e();
app.use(e.json());
app.use(errorHandler);

app.use("/api/pass", passRoutes);
app.use("/api/app", appRoutes);

db().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
