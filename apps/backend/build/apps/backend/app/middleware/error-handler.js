"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
error, request, res, _) => {
    if (error.isBoom) {
        console.log(error);
        const { statusCode, ...payload } = error.output.payload;
        res.status(statusCode).json(error.data
            ? {
                error: payload.error,
                message: payload.message,
                data: error.data || null,
            }
            : { error: payload.error, message: payload.message });
    }
    else {
        const status = error.status || 400;
        res.status(status).json({ message: error.message });
    }
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handler.js.map