"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = statusCode === 500 ? '服务器内部错误' : err.message;
    apiResponse_1.ApiResponse.error(res, statusCode, message);
};
exports.errorMiddleware = errorMiddleware;
