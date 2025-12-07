// server.js
// Start serveren med:  npm start

require("dotenv").config();

const path = require("path");
const express = require("express");
const twilio = require("twilio");

const app = express();
const PORT = process.env.PORT || 5500;

/* ---------------- EXPRESS SETUP ---------------- */
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // dine .html/.css i /public

/* ---------------- TWILIO CONFIG ---------------- */
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const apiKeySid = process.env.TWILIO_API_KEY;                // SK...
const apiKeySecret = process.env.TWILIO_API_SECRET;
const chatServiceSid = process.env.TWILIO_CHAT_SERVICE_SID;  // IS...
const globalConversationSid = process.env.TWILIO_GLOBAL_CONVERSATION_SID; // CH...

const AccessToken = twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;

// REST client med API key
const twilioRestClient = twilio(apiKeySid, apiKeySecret, { accountSid });

/* ---------------- HJÆLPER: SIKR AT BRUGER ER PARTICIPANT ---------------- */

async function ensureParticipant(identity) {
  if (!globalConversationSid) return;

  try {
    await twilioRestClient.conversations
      .v1
      .conversations(globalConversationSid)
      .participants
      .create({ identity });
  } catch (err) {
    const status = err.status || err.statusCode;
    const code = err.code;

    // Hvis participant allerede findes, gør vi ingenting
    if (status === 409 || code === 50416 || code === 50409) {
      return;
    }
    // Andre fejl ignoreres stille, så chatten stadig kan virke for andre
  }
}

/* ---------------- /twilio-token ENDPOINT ---------------- */

app.post("/twilio-token", async (req, res) => {
  try {
    const { identity } = req.body;

    if (!identity) {
      return res.status(400).json({ error: "Mangler identity" });
    }

    if (!accountSid || !apiKeySid || !apiKeySecret || !chatServiceSid) {
      console.error("Twilio environment variables mangler.");
      return res
        .status(500)
        .json({ error: "Twilio er ikke korrekt konfigureret på serveren" });
    }

    // Sørg for at brugeren er participant i global conversation
    await ensureParticipant(identity);

    // Opret AccessToken
    const token = new AccessToken(accountSid, apiKeySid, apiKeySecret, {
      identity,
      ttl: 60 * 60, // 1 time
    });

    // ChatGrant koblet til Conversations service
    const grant = new ChatGrant({
      serviceSid: chatServiceSid,
    });
    token.addGrant(grant);

    const jwt = token.toJwt();

    // Send token og identity tilbage
    res.json({ token: jwt, identity });
  } catch (err) {
    console.error("Fejl i /twilio-token:", err);
    res.status(500).json({
      error: "Kunne ikke generere Twilio Conversations token",
      details: err.message,
    });
  }
});

/* ---------------- START SERVER ---------------- */
app.listen(PORT, () => {
  console.log(`Server kører på port ${PORT} – http://localhost:${PORT}/chat.html`);
});
