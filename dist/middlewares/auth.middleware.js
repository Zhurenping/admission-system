"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyAuth = apiKeyAuth;
const API_KEYS = new Set(((_a = process.env.API_KEYS) === null || _a === void 0 ? void 0 : _a.split(',')) || []);
function apiKeyAuth(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        const error = new Error('API密钥缺失');
        error.statusCode = 401;
        return next(error);
    }
    if (!API_KEYS.has(apiKey)) {
        const error = new Error('无效的API密钥');
        error.statusCode = 403;
        return next(error);
    }
    next();
}
