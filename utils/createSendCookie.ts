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
    const isProduction = process.env.NODE_ENV === "production";
    const defaultOptions: CookieOptions = {
        httpOnly: true,
        secure: isProduction, // Must be true in production for HTTPS
        sameSite: isProduction ? 'none' : 'lax', // Must be 'none' for cross-site cookies in production
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        path: "/",
        // In production, don't set domain to allow cookies to work on all subdomains
        // In development, we need to set it to undefined to work with localhost
        domain: isProduction ? undefined : undefined
    };
    
    // Log cookie options for debugging
    if (process.env.NODE_ENV === 'development') {
        console.log('Cookie options:', JSON.stringify(defaultOptions, null, 2));
    }

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