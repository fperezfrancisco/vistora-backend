// /config/roleMap.js
// Deny-by-default RBAC map for Provider-side MVP

const PERMS = {
  // Identity & org scoping (implicitly enforced in middleware/handlers)
  "org:scope:self": true, // record scoping helper (e.g., own items)
  "org:scope:team": true, // team visibility (lead)
  "org:scope:org": true, // org-wide visibility (rcm/compliance)

  // Upload Center / Intake
  "uploads:template:view": true, // see sample CSV/XLSX templates
  "uploads:file:upload:denials": true, // intake/staff upload denials CSV/XLSX
  "uploads:file:upload:any": true, // RCM upload any (.835/.csv/.xlsx)
  "uploads:file:validate:preview": true, // see validation + row error preview
  "uploads:finalize:import": true, // confirm import -> trigger routing
  "uploads:history:view:team": true, // team upload history (lead)
  "uploads:history:view:org": true, // org upload history (rcm/compliance)
  "uploads:history:export": true, // export logs/errors

  // Denials Inbox
  "denials:read": true, // view/search/filter own scope
  "denials:read:org": true, // org-wide visibility
  "denials:assign:self": true, // self-assign (specialist/AR per policy)
  "denials:assign:bulk": true, // bulk assign/reassign (lead)
  "denials:notes:write": true, // internal notes / @mentions
  "denials:flag:highrisk:self": true, // flag own items high-risk
  "denials:flag:highrisk:team": true, // lead-level escalation flags

  // Claims Scrubber
  "scrubber:view": true, // read flags/risk
  "scrubber:annotate:claim": true, // lead can annotate claim-specific flags
  "scrubber:rules:edit": true, // RCM toggle/thresholds
  "scrubber:governance:override": true, // Compliance governance overrides

  // Appeals Generator
  "appeals:generate": true, // draft/generate packet
  "appeals:edit": true, // edit appeal text/content
  "appeals:attachments:upload": true,
  "appeals:submit": true, // submit finalized appeal
  "appeals:review:approve": true, // lead approve/return drafts
  "appeals:templates:lock": true, // Compliance lock/unlock templates
  "appeals:templates:enforce": true, // Compliance mandatory fields/gates
  "appeals:submission:block": true, // Compliance can block submission

  // Audit
  "audit:view:team": true,
  "audit:view:org": true,
  "audit:view:full": true,
};

// Role bundles (least privilege, additive)
const ROLES = {
  // 3) Charge Entry / Intake Staff
  // Upload denials CSV, validate/preview; cannot finalize import; read-only elsewhere
  charge_intake: [
    "uploads:template:view",
    "uploads:file:upload:denials",
    "uploads:file:validate:preview",
    "denials:read",
    "scrubber:view",
    // Upload history: own attempts only is handled by org scoping in queries
  ],

  // 1) Billing Specialist
  // Work the inbox, self-assign, draft & submit appeals; cannot upload/finalize or edit global rules
  billing_specialist: [
    "denials:read",
    "denials:assign:self",
    "denials:notes:write",
    "denials:flag:highrisk:self",
    "scrubber:view",
    "appeals:generate",
    "appeals:edit",
    "appeals:attachments:upload",
    "appeals:submit",
    // org scope = self-level enforced by query layer
  ],

  // 2) AR Specialist
  // Read inbox & appeals, follow-up notes; self-assign back to queue per org policy
  ar_specialist: [
    "denials:read",
    "denials:assign:self", // enable/disable per-org policy at handler
    "denials:notes:write",
    "scrubber:view",
    // appeals read-only: enforced by not granting edit/submit perms
  ],

  // 4) Team Lead / Senior Biller
  // Everything a specialist can do + team management and approvals
  team_lead: [
    "denials:read",
    "denials:assign:self",
    "denials:assign:bulk",
    "denials:notes:write",
    "denials:flag:highrisk:team",
    "scrubber:view",
    "scrubber:annotate:claim",
    "appeals:generate",
    "appeals:edit",
    "appeals:attachments:upload",
    "appeals:review:approve",
    "uploads:history:view:team",
    "uploads:history:export",
    "audit:view:team",
  ],

  // 5) Revenue Cycle Manager (RCM Manager)
  // Org-wide visibility, upload any & finalize, edit scrubber thresholds, ops analytics
  rcm_manager: [
    "denials:read",
    "denials:read:org",
    "scrubber:view",
    "scrubber:rules:edit",
    "uploads:template:view",
    "uploads:file:upload:any",
    "uploads:file:validate:preview",
    "uploads:finalize:import",
    "uploads:history:view:org",
    "uploads:history:export",
    "audit:view:org",
    // Assigning typically via leads; if acting-as-lead is needed, gate in handler
  ],

  // 6) Compliance Officer
  // Governance over templates/rules, full audit visibility; cannot assign/submit
  compliance_officer: [
    "denials:read",
    "denials:read:org",
    "scrubber:view",
    "scrubber:governance:override",
    "appeals:templates:lock",
    "appeals:templates:enforce",
    "appeals:submission:block",
    "uploads:history:view:org",
    "uploads:history:export",
    "audit:view:full",
  ],
};

module.exports = { PERMS, ROLES };
