import { Response } from "express";

interface CookieOptions {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none" | boolean;
    maxAge?: number;
    expires?: Date;
    domain?: string;
    path?: string;
    signed?: boolean;
}

interface SendCookieParams {
    res: Response;
    name: string ;
    value: string| Promise<string>;
    options?: CookieOptions;
    sendResponse?: boolean;
    responseData?: Record<string, any>;
}

const createSendCookie = ({
    res,
    name,
    value,
    options = {},
    sendResponse = false,
    responseData = {}
}: SendCookieParams) => {
    const defaultOptions: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        path: "/"
    };

    // Merge default options with provided options
    const cookieOptions = { ...defaultOptions, ...options };

    // Set the cookie
    res.cookie(name, value, cookieOptions);

    // Send response with data if requested
    if (sendResponse) {
        return res.json(responseData);
    }

    return res;
};

export default createSendCookie;