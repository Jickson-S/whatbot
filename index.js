const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('Scan this QR code:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot is ready!');
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

client.initialize();