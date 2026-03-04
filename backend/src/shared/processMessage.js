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

  // store incoming message
  store.addMessage(from, {
    from: "user",
    type: message.type,
    raw: message
  });

  if (message.type === "statuses") return;

  const text = message.text?.body?.toLowerCase().trim();

  // =========================
  // START FLOW (English)
  // =========================

  if (text === "english") {

    const payload = {
      messaging_product: "whatsapp",
      to: from,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: "Dear User 🙏 Have I got your name correctly?"
        },
        action: {
          buttons: [
            { type: "reply", reply: { id: "NAME_YES", title: "Yes" } },
            { type: "reply", reply: { id: "NAME_NO", title: "No" } }
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

  // =========================
  // BUTTON HANDLING
  // =========================

  if (message.type === "interactive" && message.interactive?.button_reply) {

    const id = message.interactive.button_reply.id;

    // NAME YES → USER CATEGORY
    if (id === "NAME_YES") {

      const payload = {
        messaging_product: "whatsapp",
        to: from,
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text:
              "Perfect 🙌 Before we go ahead please select what best describes you."
          },
          action: {
            buttons: [
              {
                type: "reply",
                reply: { id: "DONOR", title: "💰Donor / Visitor" }
              },
              {
                type: "reply",
                reply: { id: "CUSTOMER", title: "🛍Customer" }
              },
              {
                type: "reply",
                reply: { id: "VOLUNTEER", title: "🤝Volunteer" }
              }
            ]
          }
        }
      };

      await sendWhatsAppMessage(payload);
      return;
    }

    // NAME NO → ASK NAME
    if (id === "NAME_NO") {

      const payload = {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: {
          body: "Please type your correct name ✍️"
        }
      };

      await sendWhatsAppMessage(payload);
      return;
    }

    // =========================
    // DONOR / VISITOR
    // =========================

    if (id === "DONOR") {

      const payload = {
        messaging_product: "whatsapp",
        to: from,
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text:
              "How can I assist you today?"
          },
          action: {
            buttons: [
              {
                type: "reply",
                reply: { id: "SHASTRA_DAAN", title: "📚 Shastra Daan" }
              },
              {
                type: "reply",
                reply: { id: "PURCHASE_BOOKS", title: "🛒 Purchase Books" }
              },
              {
                type: "reply",
                reply: { id: "ASK_QUERY", title: "❓ Ask Queries" }
              }
            ]
          }
        }
      };

      await sendWhatsAppMessage(payload);
      return;
    }

    // =========================
    // SHASTRA DAAN
    // =========================

    if (id === "SHASTRA_DAAN") {

      const payload = {
        messaging_product: "whatsapp",
        to: from,
        type: "image",
        image: {
          link:
            "https://files.gallabox.com/6700d61271e24a41955f4152/3f8c428f-e286-43eb-bdde-81d1afdc8089-SastraDana2023EnglishBackLowRes.png",
          caption:
            "🌸 Help us distribute Bhagavad Gita and Vedic books to people in need."
        }
      };

      await sendWhatsAppMessage(payload);
      return;
    }

    // =========================
    // PURCHASE BOOKS
    // =========================

    if (id === "PURCHASE_BOOKS") {

      const payload = {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: {
          body:
            "Please visit our store:\nhttps://jivadaya.org/shop"
        }
      };

      await sendWhatsAppMessage(payload);
      return;
    }

    // =========================
    // ASK QUERIES
    // =========================

    if (id === "ASK_QUERY") {

      const payload = {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: {
          body:
            "Please send your query. Our team will assist you soon."
        }
      };

      await sendWhatsAppMessage(payload);
      return;
    }

    // =========================
    // VOLUNTEER
    // =========================

    if (id === "VOLUNTEER") {

      const payload = {
        messaging_product: "whatsapp",
        to: from,
        type: "interactive",
        interactive: {
          type: "list",
          body: {
            text: "Volunteer Menu"
          },
          action: {
            button: "View Menu",
            sections: [
              {
                title: "General Options",
                rows: [
                  {
                    id: "PRICE_LIST",
                    title: "Get Book Price List"
                  },
                  {
                    id: "PAMPHLET",
                    title: "Shastra Daan Pamphlet"
                  },
                  {
                    id: "POSTER",
                    title: "Marathon Poster"
                  }
                ]
              }
            ]
          }
        }
      };

      await sendWhatsAppMessage(payload);
      return;
    }

  }

  // =========================
  // LIST REPLY HANDLING
  // =========================

  if (message.type === "interactive" && message.interactive?.list_reply) {

    const selected = message.interactive.list_reply.id;

    if (selected === "PRICE_LIST") {

      const payload = {
        messaging_product: "whatsapp",
        to: from,
        type: "image",
        image: {
          link:
            "https://files.gallabox.com/6700d61271e24a41955f4152/aadd3893-1ac8-4662-a52c-76293650dd8e-Pricelist.jpeg"
        }
      };

      await sendWhatsAppMessage(payload);
      return;
    }

    if (selected === "PAMPHLET") {

      const payload = {
        messaging_product: "whatsapp",
        to: from,
        type: "image",
        image: {
          link:
            "https://files.gallabox.com/6700d61271e24a41955f4152/f1867f84-4631-4261-8dd0-cda50ef82986-SastraDana2023EnglishFrontLowRes.png"
        }
      };

      await sendWhatsAppMessage(payload);
      return;
    }

    if (selected === "POSTER") {

      const payload = {
        messaging_product: "whatsapp",
        to: from,
        type: "image",
        image: {
          link:
            "https://files.gallabox.com/6700d61271e24a41955f4152/3d4fec9c-fe27-456b-a6e5-752259feac3c-MarathonFlex4x6inLowRes.png"
        }
      };

      await sendWhatsAppMessage(payload);
      return;
    }

  }

  // =========================
  // DEFAULT RESPONSE
  // =========================

  if (text) {

    const payload = {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        body: "Please type *English* to start."
      }
    };

    await sendWhatsAppMessage(payload);
  }

}

module.exports = processMessage;