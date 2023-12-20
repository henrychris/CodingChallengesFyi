import express from "express";
import connectDB from "./util/db";
import { CustomRequest, ShortenerRequest } from "./models/shortenerRequest";
import { shorten } from "./util/shortener";
import { GetLongUrl } from "./util/navigate";
import { safe } from "./util/safe";

const app = express();
app.use(express.json()); // this is important, as this middleware parses json from the request
const PORT = 3000;

connectDB();

app.get("/:shortCode", async (req, res): Promise<void> => {
    const shortCode = req.params.shortCode as string;

    if (!shortCode) {
        res.status(400).send({
            success: false,
            message: "The URL is required.",
        });
    }

    const result = await safe(GetLongUrl(shortCode));
    if (!result.success) {
        res.status(400).send({
            success: false,
            message: `A URL with the shortCode ${shortCode} was not found.`,
        });
        return;
    }

    res.redirect(result.data);
});

app.post("/shorten", async (req: CustomRequest<ShortenerRequest>, res) => {
    if (!req.body.longUrl) {
        res.status(400).send({
            success: false,
            message: "The URL is required.",
        });
        return;
    }

    var createdResponse = await shorten(req.body.longUrl);
    if (createdResponse) {
        res.status(200).send({ success: true, data: createdResponse });
    }
    res.status(400).send({ success: false, message: "Something went wrong." });
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}...`);
});
