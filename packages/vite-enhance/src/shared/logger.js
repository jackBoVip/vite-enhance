export function createLogger(name) {
    const prefix = `[vek:${name}]`;
    return {
        info: (msg, ...args) => console.log(prefix, msg, ...args),
        warn: (msg, ...args) => console.warn(prefix, msg, ...args),
        error: (msg, ...args) => console.error(prefix, msg, ...args),
        debug: (msg, ...args) => {
            if (process.env.DEBUG)
                console.debug(prefix, msg, ...args);
        },
    };
}
//# sourceMappingURL=logger.js.map