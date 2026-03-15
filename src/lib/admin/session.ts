import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "wedding_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 14;

export function getAdminSessionCookieDomain() {
    if (process.env.NODE_ENV !== "production") return undefined;
    return "thepainewedding.com";
}

export function getAdminSessionCookieBaseOptions() {
    return {
        name: ADMIN_SESSION_COOKIE,
        httpOnly: true,
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production",
        path: "/",
    };
}

function getSessionSecret() {
    return (
        process.env.ADMIN_SESSION_SECRET ||
        [
            process.env.ADMIN_PASSWORD_MASTER,
            process.env.ADMIN_PASSWORD_1,
            process.env.ADMIN_PASSWORD_2,
            process.env.ADMIN_PASSWORD_3,
            process.env.ADMIN_PASSWORD_4,
            process.env.ADMIN_PASSWORD_5,
        ]
            .filter(Boolean)
            .join("|")
    );
}

function signPayload(payload: string) {
    return createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
}

export function createAdminSessionToken(role: string) {
    const expiresAt = Date.now() + ADMIN_SESSION_MAX_AGE * 1000;
    const payload = `${role}.${expiresAt}`;
    const signature = signPayload(payload);
    return `${payload}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined) {
    if (!token) return null;

    const [role, expiresAtRaw, signature] = token.split(".");
    if (!role || !expiresAtRaw || !signature) return null;

    const payload = `${role}.${expiresAtRaw}`;
    const expectedSignature = signPayload(payload);

    const provided = Buffer.from(signature);
    const expected = Buffer.from(expectedSignature);

    if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
        return null;
    }

    const expiresAt = Number(expiresAtRaw);
    if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) {
        return null;
    }

    return { role, expiresAt };
}
