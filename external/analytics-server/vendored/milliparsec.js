/* eslint-disable curly */
/* eslint-disable no-void */
/* eslint-disable no-undef */

// local, minified copy of milliparsec due to https://github.com/denoland/deno/issues/28120
import { Buffer } from 'node:buffer';
export const hasBody = (method) => ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
const defaultPayloadLimit = 102400; // 100KB
const defaultErrorFn = (payloadLimit) => new Error(`Payload too large. Limit: ${payloadLimit} bytes`);
// Main function
export const p = (fn, payloadLimit = defaultPayloadLimit, payloadLimitErrorFn = defaultErrorFn) => async (req, _res, next) => {
    try {
        const body = [];
        for await (const chunk of req) {
            const totalSize = body.reduce((total, buffer) => total + buffer.byteLength, 0);
            if (totalSize > payloadLimit)
                throw payloadLimitErrorFn(payloadLimit);
            body.push(chunk);
        }
        return fn(Buffer.concat(body));
    }
    catch (e) {
        next === null || next === void 0 ? void 0 : next(e);
    }
};
/**
 * Parse JSON payload
 * @param options
 */
const json = ({ payloadLimit, payloadLimitErrorFn } = {}) => async (req, res, next) => {
    if (hasBody(req.method)) {
        req.body = await p((x) => {
            const str = td.decode(x);
            return str ? JSON.parse(str) : {};
        }, payloadLimit, payloadLimitErrorFn)(req, res, next);
    }
    next === null || next === void 0 ? void 0 : next();
};

const td = new TextDecoder();

export { json };
