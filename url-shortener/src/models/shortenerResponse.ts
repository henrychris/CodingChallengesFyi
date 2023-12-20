export default class ShortenerResponse {
    constructor(key: string, longUrl: string, shortUrl: string) {
        this.key = key;
        this.longUrl = longUrl;
        this.shortUrl = shortUrl;
    }

    key: string;
    longUrl: string;
    shortUrl: string;
}