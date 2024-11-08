const { Client } = require('whatsapp-web.js');
const client = new Client();

// client.on('qr', (qr) => {
//   console.log('QR RECEIVED', qr); 
// });

// client.on('ready', () => {
//   console.log('Client is ready!');
// });

// client.on('authenticated', () => {
//   console.log('WhatsApp authenticated successfully');
// });

client.initialize();

const sendMessage = async (phoneNumber, message) => {
  try {
    client.on('ready', async () => {
      try {
        const formattedPhoneNumber = phoneNumber.includes('@c.us') ? phoneNumber : `${phoneNumber}@c.us`;
        await client.sendMessage(formattedPhoneNumber, message);
        // console.log('Message sent successfully');
      } catch (error) {
        console.error('Error sending WhatsApp message:', error);
      }
    });
  } catch (error) {
    console.error('Error in sending message logic:', error);
  }
};

module.exports = { sendMessage };
