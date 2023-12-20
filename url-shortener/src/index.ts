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

app.post("/shorten", async (req: CustomRequest<ShortenerRequest>, res) => {
    if (!req.body.longUrl) {
        res.status(400).send({
            error: true,
            message: "The URL is required.",
        });
        return;
    }

    var createdResponse = await shorten(req.body.longUrl);
    if (createdResponse) {
        res.status(200).send(createdResponse);
    }
    res.status(400).send({ error: true, message: "Something went wrong." });
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}...`);
});
