const response = {
    success: (res, code, data, message) => {
        const result = {
            message,
            success: true,
            code,
            data
        };

        res.status(code).json(result)
    },
    failed: (res, code, data, message) => {
        const result = {
            message,
            success: false,
            code,
            data
        };

        res.status(code).json(result)
    },
    successWithMeta: (res, code, data, meta, message) => {
        const result = {
            message,
            success: true,
            code,
            meta,
            data
        };

        res.status(200).json(result)
    }
};

module.exports = response