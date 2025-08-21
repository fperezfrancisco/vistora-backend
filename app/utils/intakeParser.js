// utils/intakeParser.js

// Mock parser that simulates parsing a denial intake file (e.g., .835 or .csv)
function parseIntakeFile(fileBuffer) {
  // In real use, you'd parse fileBuffer (CSV, EDI, etc.)
  // Here we return a mock array of denial objects

  return [
    {
      claimId: "claim_001",
      reasonCode: "CARC 96",
      remarkCode: "M15",
      denialReasonText: "Non-covered charges",
      classification: "technical",
      intakeSource: "835 ERA",
      providerId: "provider_xyz",
      uploadedBy: "user_abc",
      createdAt: new Date(),
    },
    {
      claimId: "claim_002",
      reasonCode: "CARC 109",
      remarkCode: "N30",
      denialReasonText: "Claim not covered by plan",
      classification: "clinical",
      intakeSource: "835 ERA",
      providerId: "provider_xyz",
      uploadedBy: "user_abc",
      createdAt: new Date(),
    },
  ];
}

module.exports = { parseIntakeFile };
