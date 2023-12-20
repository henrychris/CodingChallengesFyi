import { Request } from "express";

export interface ShortenerRequest {
    longUrl: string;
}

export interface CustomRequest<T> extends Request {
    body: T;
}
