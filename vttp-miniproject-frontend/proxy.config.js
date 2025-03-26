module.exports = [
    {
        context: ['/api/**'],
        target: 'http://localhost:8080',
        secure: false,
        changeOrigin: true, // Prevents CORS issues
        logLevel: "debug"
    },
    {
        context: ['/ws/**'],
        target: 'http://localhost:8080',
        secure: false,
        ws: true,
        logLevel: 'debug',
        changeOrigin: true
    }

    
]