import express from "express";
import connectDB from "./util/db";
import { CustomRequest, ShortenerRequest } from "./models/shortenerRequest";
import { shorten } from "./util/shortener";

const app = express();
app.use(express.json()); // this is important, as this middleware parses json from the request
const PORT = 3000;

connectDB();

app.get("/", (_req, res): void => {
    res.send("Hello World!");
});

app.post(
    "/shorten",
    async (req: CustomRequest<ShortenerRequest>, res): Promise<void> => {
        var createdResponse = await shorten(req.body.longUrl);
        // todo: create an errorOr type structure or, throw exceptions
        res.send(createdResponse);
    }
);

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}...`);
});
