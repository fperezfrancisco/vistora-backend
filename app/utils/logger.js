const { db } = require("../utils/firebaseAdmin");

async function logEvent(message, metadata = {}, persist = false) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    message,
    timestamp,
    ...metadata,
  };

  // Always log to console
  console.log(`[${timestamp}] ${message}`, metadata);

  // Optional: persist to Firestore
  if (persist) {
    try {
      await db.collection("auditLogs").add(logEntry);
    } catch (err) {
      console.error("Failed to log event to Firestore:", err);
    }
  }
}

module.exports = { logEvent };
