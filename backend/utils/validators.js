// utils/validators.js
function isValidObjectId(id) {
  return typeof id === "string" && id.length === 24;
}

module.exports = { isValidObjectId };
