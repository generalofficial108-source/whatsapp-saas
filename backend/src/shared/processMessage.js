const axios = require("axios");
const store = require("./conversationStore");

async function sendWhatsAppMessage(payload) {
  await axios.post(
    `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );
}

async function processMessage(message) {
  const from = message.from;

  // 🔥 ALWAYS store incoming RAW message
  store.addMessage(from, {
    from: "user",
    type: message.type,
    raw: message
  });

  // Ignore status messages
  if (message.type === "statuses") return;

  const text = message.text?.body?.toLowerCase();

  // =========================
  // 1️⃣ HELLO → BUTTON MESSAGE
  // =========================
  if (text === "hello") {
    const payload = {
      messaging_product: "whatsapp",
      to: from,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: "👋 Welcome to Our Service!" },
        action: {
          buttons: [
            {
              type: "reply",
              reply: { id: "BUY", title: "🛒 Buy" }
            },
            {
              type: "reply",
              reply: { id: "SELL", title: "💰 Sell" }
            },
            {
              type: "reply",
              reply: { id: "CONTACT", title: "📞 Contact" }
            }
          ]
        }
      }
    };

    await sendWhatsAppMessage(payload);

    // 🔥 Store FULL RAW outgoing payload
    store.addMessage(from, {
      from: "bot",
      type: payload.type,
      raw: payload
    });

    return;
  }

  // ===================================
  // 2️⃣ BUTTON REPLY HANDLING
  // ===================================
  if (message.type === "interactive" && message.interactive?.button_reply) {
    const buttonId = message.interactive.button_reply.id;

    // BUY → LIST MESSAGE
    if (buttonId === "BUY") {
      const payload = {
        messaging_product: "whatsapp",
        to: from,
        type: "interactive",
        interactive: {
          type: "list",
          body: { text: "🛒 Available Products" },
          action: {
            button: "View Products",
            sections: [
              {
                title: "Electronics",
                rows: [
                  {
                    id: "P1",
                    title: "Laptop ₹50,000",
                    description: "i7 / 16GB / 512GB"
                  },
                  {
                    id: "P2",
                    title: "Phone ₹25,000",
                    description: "8GB / 128GB"
                  }
                ]
              }
            ]
          }
        }
      };

      await sendWhatsAppMessage(payload);

      store.addMessage(from, {
        from: "bot",
        type: payload.type,
        raw: payload
      });

      return;
    }

    // SELL → IMAGE MESSAGE
    if (buttonId === "SELL") {
      const payload = {
        messaging_product: "whatsapp",
        to: from,
        type: "image",
        image: {
          link: "https://picsum.photos/400",
          caption: "📦 Send your product details with image."
        }
      };

      await sendWhatsAppMessage(payload);

      store.addMessage(from, {
        from: "bot",
        type: payload.type,
        raw: payload
      });

      return;
    }

    // CONTACT → TEXT
    if (buttonId === "CONTACT") {
      const payload = {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: {
          body: "📞 Contact us at support@example.com"
        }
      };

      await sendWhatsAppMessage(payload);

      store.addMessage(from, {
        from: "bot",
        type: payload.type,
        raw: payload
      });

      return;
    }
  }

  // ===================================
  // 3️⃣ LIST REPLY HANDLING
  // ===================================
  if (message.type === "interactive" && message.interactive?.list_reply) {
    const selected = message.interactive.list_reply.title;

    const payload = {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        body: `✅ You selected: ${selected}`
      }
    };

    await sendWhatsAppMessage(payload);

    store.addMessage(from, {
      from: "bot",
      type: payload.type,
      raw: payload
    });

    return;
  }

  // ===================================
  // 4️⃣ DEFAULT TEXT RESPONSE
  // ===================================
  if (text) {
    const payload = {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        body: "Please type 'hello' to start."
      }
    };

    await sendWhatsAppMessage(payload);

    store.addMessage(from, {
      from: "bot",
      type: payload.type,
      raw: payload
    });
  }
}

module.exports = processMessage;