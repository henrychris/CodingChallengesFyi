import { StoredUrl } from "../models/storedUrls";

export async function DeleteUrl(shortCode: string): Promise<void> {
    await StoredUrl.deleteOne({ key: shortCode });
}
