import qrcode from 'qrcode-terminal'
import whatsappweb from 'whatsapp-web.js'
const { Client, LocalAuth } = whatsappweb
const client = new Client({
    authStrategy: new LocalAuth({ dataPath: '.auth' }),
    restartOnAuthFail: true,
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
            '--single-process'
        ]
    }
})

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