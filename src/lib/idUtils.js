/**
 * Small ID / cloning / display helpers used across the app.
 */

function uid(prefix) {
  return prefix + "_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

function initials(name) {
  return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

function toggleInArray(arr, val) {
  return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
}

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

export { uid, initials, toggleInArray, deepClone };
