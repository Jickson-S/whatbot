import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import qrcode from 'qrcode-terminal'
import whatsappweb from 'whatsapp-web.js'

dotenv.config()
const { Client, LocalAuth } = whatsappweb

// ---- Express setup ----
const app = express()
app.use(cors())
app.use(express.json())

// ... your existing routes (auth, uploads, etc.) go here ...

const PORT = process.env.PORT || 3000

// Start listening immediately — don't wait on WhatsApp
app.listen(PORT, () => console.log(`API listening on port ${PORT}`))

// ---- MongoDB ----
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err))

// ---- WhatsApp client ----
const client = new Client({
  authStrategy: new LocalAuth({ dataPath: '.auth' }),
  restartOnAuthFail: true,
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote',
      '--disable-gpu', '--disable-extensions', '--disable-background-networking',
      '--disable-default-apps', '--disable-sync', '--disable-translate',
      '--metrics-recording-only', '--mute-audio',
      '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding',
      '--single-process'
    ]
  }
})

client.on('qr', (qr) => { console.log('Scan this QR code:'); qrcode.generate(qr, { small: true }) })
client.on('ready', () => console.log('Bot is ready!'))
client.on('message', async (message) => {
  console.log(message.body)
  if (message.body.toLowerCase() === 'hi') message.reply('Hello 👋 this is a test bot')
  if (message.body.toLowerCase() === 'ping') message.reply('pong 🏓')
  if (message.body.toLowerCase() === 'time') message.reply('Current time: ' + new Date().toLocaleString())
})

client.initialize() // runs in the background, doesn't block app.listen()

export { client } // so your route handlers can call client.sendMessage(...) if needed