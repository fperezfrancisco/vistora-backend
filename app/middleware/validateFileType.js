// middleware/validateFileType.js
module.exports = function validateFileType(req, res, next) {
  const file = req.file;
  if (!file) return res.status(400).send("No file uploaded");

  const allowedTypes = [
    "application/pdf",
    "text/csv",
    "application/octet-stream",
  ];
  const allowedExts = [".pdf", ".csv", ".835"];
  const ext = file.originalname.split(".").pop().toLowerCase();

  if (
    !allowedTypes.includes(file.mimetype) ||
    !allowedExts.includes(`.${ext}`)
  ) {
    return res
      .status(400)
      .json({ error: "Only PDF, CSV, or .835 files are allowed." });
  }

  next();
};
