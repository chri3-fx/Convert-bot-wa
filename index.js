const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require('@whiskeysockets/baileys');

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth');

  const sock = makeWASocket({
    auth: state,
    browser: ['ArbAlertBot', 'Chrome', '1.0'],
    syncFullHistory: false
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'open') {
      console.log('✅ WhatsApp connected');

      const myNumber = '2347025082930@s.whatsapp.net';

      try {
        await sock.sendMessage(myNumber, {
          text: '✅ Arb Alert Bot is live and stable'
        });
        console.log('📤 Test message sent');
      } catch (err) {
        console.error('❌ Message send failed:', err.message);
      }
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;

      if (statusCode === DisconnectReason.loggedOut) {
        console.log('❌ Logged out. Delete auth folder and rescan QR.');
      } else {
        console.log('🔄 Connection lost. Reconnecting...');
        startBot();
      }
    }
  });
}

startBot();
