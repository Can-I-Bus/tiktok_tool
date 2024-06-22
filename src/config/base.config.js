let url = '';
let env = process.env.NODE_ENV;

if (env === 'development') {
    url = 'http://localhost:9000/tiktok';
} else {
    url = 'http://localhost:9000/tiktok';
}

export default {
    BASE_URL: url,
    TIMEOUT: 600000,
};
