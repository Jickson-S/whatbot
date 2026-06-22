import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// State management for WhatsApp client status
let clientStatus = 'INITIALIZING'; // 'INITIALIZING', 'QR_READY', 'CONNECTED', 'DISCONNECTED'
let qrCodeData = '';

import qrcode from 'qrcode-terminal'
import whatsappweb from 'whatsapp-web.js'
const { Client, LocalAuth } = whatsappweb

const client = new Client({
    authStrategy: new LocalAuth({ dataPath: '.auth' }),
    restartOnAuthFail: true,
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html'
    },
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--disable-extensions',
            '--disable-background-networking',
            '--disable-default-apps',
            '--disable-sync',
            '--disable-translate',
            '--metrics-recording-only',
            '--mute-audio',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--single-process',
            '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
        ]
    }
})

client.on('qr', (qr) => {
    console.log('Scan this QR code:');
    qrcode.generate(qr, { small: true });
    clientStatus = 'QR_READY';
    qrCodeData = qr;
});

client.on('ready', () => {
    console.log('Bot is ready!');
    clientStatus = 'CONNECTED';
    qrCodeData = '';
});

client.on('auth_failure', (msg) => {
    console.error('Authentication failure:', msg);
    clientStatus = 'DISCONNECTED';
    qrCodeData = '';
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out:', reason);
    clientStatus = 'DISCONNECTED';
    qrCodeData = '';
});

client.on('message', async (message) => {
    console.log(message.body);

    // Simple test replies
    if (message.body.toLowerCase() === 'hi') {
        message.reply('Hello 👋 this is a test bot');
    }

    if (message.body.toLowerCase() === 'ping') {
        message.reply('pong 🏓');
    }

    if (message.body.toLowerCase() === 'time') {
        message.reply('Current time: ' + new Date().toLocaleString());
    }
});

// Serve frontend static files
app.use(express.static('public'));

// API endpoint to retrieve current status and QR code data
app.get('/api/status', (req, res) => {
    res.json({
        status: clientStatus,
        qr: qrCodeData
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

client.initialize();