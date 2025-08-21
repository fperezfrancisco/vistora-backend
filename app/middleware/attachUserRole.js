// /middleware/attachUserRole.js
const admin = require("../utils/firebaseAdmin");
const { ROLES } = require("../config/roleMap");

// Optional: tiny LRU to cut Firestore reads on hot paths --> caching for less backend api hits
class LRU {
  constructor(limit = 500, ttlMs = 60_000) {
    this.limit = limit;
    this.ttl = ttlMs;
    this.map = new Map();
  }
  get(k) {
    const v = this.map.get(k);
    if (!v) return null;
    if (Date.now() - v.t > this.ttl) {
      this.map.delete(k);
      return null;
    }
    // bump recency
    this.map.delete(k);
    this.map.set(k, v);
    return v.v;
  }
  set(k, v) {
    if (this.map.size >= this.limit)
      this.map.delete(this.map.keys().next().value);
    this.map.set(k, { v, t: Date.now() });
  }
}
const cache = new LRU();

const attachUserRole = async (req, res, next) => {
  try {
    if (!req.user?.uid)
      return res.status(401).json({ message: "Unauthenticated" });

    const cacheKey = `u:${req.user.uid}`;
    let profile = cache.get(cacheKey);

    if (!profile) {
      const doc = await admin
        .firestore()
        .collection("users")
        .doc(req.user.uid)
        .get();
      if (!doc.exists)
        return res.status(403).json({ message: "User profile not found" });

      const data = doc.data();
      // Expect: { role: 'billing_specialist' | 'rcm_manager' | ..., orgId: 'org_123', disabled?: boolean }
      if (data.disabled)
        return res.status(423).json({ message: "Account disabled" });
      if (!data.role || !data.orgId) {
        return res
          .status(403)
          .json({ message: "User role/org not configured" });
      }

      // Normalize role key
      const roleKey = String(data.role).toLowerCase().trim();
      const rolePerms = ROLES[roleKey];
      if (!rolePerms)
        return res.status(403).json({ message: "Role not recognized" });

      profile = {
        uid: req.user.uid,
        email: req.user.email || null,
        role: roleKey,
        orgId: String(data.orgId),
        teamId: data.teamId || null,
        // Use a Set for O(1) permission checks in authorize()
        perms: new Set(rolePerms),
      };

      cache.set(cacheKey, profile);
    }

    // Attach a minimal, read-only auth context for the request
    req.authz = Object.freeze({
      uid: profile.uid,
      orgId: profile.orgId,
      teamId: profile.teamId,
      role: profile.role,
      has: (p) => profile.perms.has(p),
      // convenience scopes for handlers (optional)
      scope: {
        self: profile.uid,
        org: profile.orgId,
        team: profile.teamId,
      },
    });

    next();
  } catch (err) {
    console.error("attachUserRole error:", err?.message || err);
    res.status(500).json({ message: "Role resolution failed" });
  }
};

module.exports = attachUserRole;
