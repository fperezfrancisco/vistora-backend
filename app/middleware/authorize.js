// /middleware/authorize.js

/**
 * authorize(requiredPerms, options?)
 *
 * Usage:
 *   router.post("/uploads/finalize",
 *     verifyFirebaseToken,
 *     attachUserRole,
 *     authorize("uploads:finalize:import"),
 *     handler);
 *
 *   router.post("/denials/bulk-assign",
 *     verifyFirebaseToken,
 *     attachUserRole,
 *     authorize("denials:assign:bulk", { requireAll: true }),
 *     handler);
 *
 * Options:
 *   - requireAll: boolean (default: false; when array is provided)
 *   - scopeCheck: (req) => boolean  // optional extra guard (e.g., org/team/self)
 *   - onDeny: (req, res) => any     // optional custom deny handler
 */
function authorize(requiredPerms, options = {}) {
  const { requireAll = false, scopeCheck, onDeny } = options;

  // Normalize to array
  const perms = Array.isArray(requiredPerms) ? requiredPerms : [requiredPerms];

  return (req, res, next) => {
    const correlationId =
      req.headers["x-correlation-id"] ||
      req.headers["x-request-id"] ||
      cryptoSafeRandomId();

    // Basic presence checks
    const a = req.authz;
    if (!a?.role || !a?.has) {
      return deny(403, "Missing auth context", {
        req,
        res,
        onDeny,
        correlationId,
      });
    }

    // Permission checks (O(1) thanks to Set in attachUserRole)
    const hasAll = perms.every((p) => a.has(p));
    const hasAny = perms.some((p) => a.has(p));
    const pass = requireAll ? hasAll : hasAny;

    if (!pass) {
      return deny(403, "Forbidden (insufficient permission)", {
        req,
        res,
        onDeny,
        correlationId,
        details: { role: a.role, required: perms, requireAll },
      });
    }

    // Optional scope check (e.g., ensure resource.orgId === req.authz.orgId)
    if (typeof scopeCheck === "function") {
      try {
        const inScope = scopeCheck(req);
        if (!inScope) {
          return deny(403, "Forbidden (out of scope)", {
            req,
            res,
            onDeny,
            correlationId,
          });
        }
      } catch (err) {
        return deny(500, "Scope check error", {
          req,
          res,
          onDeny,
          correlationId,
          details: { error: err?.message },
        });
      }
    }

    // All good
    res.setHeader("x-correlation-id", correlationId);
    return next();
  };
}

function deny(status, message, { req, res, onDeny, correlationId, details }) {
  // Minimal, HIPAA-safe audit line (no PHI)
  try {
    console.warn(
      JSON.stringify({
        event: "authz.denied",
        status,
        message,
        role: req?.authz?.role || null,
        uid: req?.authz?.uid || null,
        orgId: req?.authz?.orgId || null,
        route: `${req?.method} ${req?.originalUrl}`,
        correlationId,
        details: sanitize(details),
        ts: new Date().toISOString(),
      })
    );
  } catch (_) {}

  res.setHeader("x-correlation-id", correlationId);

  if (typeof onDeny === "function") {
    return onDeny(req, res);
  }
  return res.status(status).json({
    error: "forbidden",
    message,
    correlationId,
  });
}

function cryptoSafeRandomId() {
  // Small, dependency-free ID for correlation
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function sanitize(obj) {
  // Defensive: ensure we never leak payload bodies/PHI accidentally
  if (!obj) return undefined;
  try {
    const clone = JSON.parse(JSON.stringify(obj));
    if (clone?.payload) clone.payload = "[redacted]";
    if (clone?.body) clone.body = "[redacted]";
    return clone;
  } catch {
    return undefined;
  }
}

module.exports = { authorize };
