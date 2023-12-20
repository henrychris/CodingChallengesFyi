import ShortenerResponse from "../models/shortenerResponse";
import { StoredUrl } from "../models/storedUrls";
import { safe } from "./safe";
import { Md5 } from "ts-md5";
import * as b62 from "./base62";

const BASE_URL = "https://mysite.com/";

export async function shorten(
    longUrl: string
): Promise<ShortenerResponse | null> {
    let existingUrl = await StoredUrl.findOne({ longUrl: longUrl });
    if (existingUrl) {
        console.log("Fetched existing url");
        return new ShortenerResponse(
            existingUrl.key,
            existingUrl.longUrl,
            existingUrl.shortUrl
        );
    }

    console.log("Generating new url...");
    let result = await generateNewUrl(longUrl);
    return result;
}

async function generateNewUrl(
    longUrl: string
): Promise<ShortenerResponse | null> {
    let urlKey = hashUrl(longUrl);
    let attemptCount = 0;

    while (attemptCount < 5) {
        const storedUrl = new StoredUrl({
            key: urlKey,
            longUrl: longUrl,
            shortUrl: BASE_URL + urlKey,
        });

        let result = await safe(ValidateHash(storedUrl));

        if (!result.success) {
            // Regenerate the hash using some variation
            urlKey = hashUrl(longUrl + attemptCount);
            attemptCount++;
        } else {
            StoredUrl.create(storedUrl);
            return new ShortenerResponse(
                storedUrl.key,
                storedUrl.longUrl,
                storedUrl.shortUrl
            );
        }
    }

    return null; // If unable to generate a valid hash after multiple attempts
}

function hashUrl(url: string): string {
    const hash = Md5.hashStr(url);
    const encoded: string = b62.encode(hash);
    const key = encoded.substring(0, 7);

    console.log(`Short URL generated: ${key}.`);
    return key;
}

async function ValidateHash(urlObj: StoredUrl) {
    let objWithMatchingKeyAndDifferentUrl = await StoredUrl.findOne({
        key: urlObj.key,
    });
    if (
        objWithMatchingKeyAndDifferentUrl &&
        objWithMatchingKeyAndDifferentUrl.longUrl != urlObj.longUrl
    ) {
        console.log(`Object Found: ${objWithMatchingKeyAndDifferentUrl}`);
        throw new Error("This key exists for another URL.");
    }
}
