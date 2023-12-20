import { StoredUrl } from "../models/storedUrls";

export async function GetLongUrl(shortCode: string): Promise<string> {
    try {
        const existingUrl = await StoredUrl.findOne({ key: shortCode });

        if (existingUrl) {
            console.log(`Found url with code ${shortCode}.`);
            return existingUrl.longUrl;
        } else {
            throw new Error("URL not found.");
        }
    } catch (error) {
        console.error("Error retrieving URL:", error);
        throw new Error("Error retrieving URL");
    }
}
