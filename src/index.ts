import qrcode from "qrcode-terminal";
import { Client, LocalAuth } from "whatsapp-web.js";

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message_create", async (msg) => {
  const contact = msg.getContact();

  // stop the listener if message is from a status or group
  if (msg.isStatus || (await contact).isGroup) return;

  if (
    (msg.body.toLowerCase().startsWith("!sticker") ||
      msg.body.toLowerCase().startsWith("/sticker") ||
      msg.body.toLowerCase().startsWith(".sticker")) &&
    msg.type == "image"
  ) {
    let media;

    try {
      media = await msg.downloadMedia();
    } catch (error) {
      console.error(error);
      return msg.reply("Proses mengunduh gambar gagal!");
    }

    client.sendMessage(msg.from, media, {
      sendMediaAsSticker: true,
    });
  }
});

client.initialize();
