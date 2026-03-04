const axios = require("axios");
const conversationStore = require("../shared/conversationStore");

exports.getUsers = (req, res) => {
  res.json(conversationStore.getUsers());
};

exports.getMessages = (req, res) => {
  const { user } = req.params;
  res.json(conversationStore.getMessages(user));
};

exports.getStats = (req, res) => {
  const users = conversationStore.getUsers();
  res.json({
    totalUsers: users.length
  });
};

exports.sendMessage = async (req, res) => {
  const { to, message } = req.body;

  try {
    await axios.post(
      `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    conversationStore.addMessage(to, {
      from: "admin",
      text: message
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false });
  }
};