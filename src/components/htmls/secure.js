// secureKey.js (hidden key builder)

const a = ["A", "A", "X"].join(""); // "AAX"
const b = ["4", "8"].join(""); // "48"
const c = "Z9Y"; // "Z9Y"

export const __APP_LOCK_KEY__ = a + b + c; 
// Final key → "AAX48Z9Y"
