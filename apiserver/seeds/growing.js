import mongoose from "mongoose";
import config from "config";
import { updateGrowingCommunitiesList } from "../cronjobs/"

// connect to database
console.log("Connecting to database..");
mongoose.connect(config.DBHost, { useNewUrlParser: true, useCreateIndex: true });

mongoose.connection.on("open", async () => {
    // update growing communities list
    console.log("Update growing communities list..");
    await updateGrowingCommunitiesList();

    // disconnect from database
    console.log("Disconnecting from database..");
    mongoose.connection.close();
});


