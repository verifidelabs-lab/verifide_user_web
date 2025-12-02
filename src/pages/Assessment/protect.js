// protect.js — prevents unauthorized runs

import { __APP_LOCK_KEY__ } from "../../components/htmls/secure";

(function () {
  const expected = __APP_LOCK_KEY__;
  const stored = localStorage.getItem("__myapp_lock_key__");

  if (stored !== expected) {
    // Replace UI
    document.body.innerHTML = `
      <div style="
        font-family: sans-serif;
        text-align: center;
        margin-top: 50px;
        color: #c00;
      ">
        <h1>⚠️ Unauthorized Environment</h1>
        <p>This build is locked and cannot be run.</p>
      </div>
    `;

    // Completely stop JS runtime without errors
    const stop = () => {};
    window.stop = stop;
    window.onerror = stop;
    window.onunhandledrejection = stop;

    // Freeze execution silently
    while (true) {}
  }

  // Obfuscation logic
  const enc = btoa(expected.split("").reverse().join(""));
  const check = atob(enc).split("").reverse().join("");

  if (check !== expected) {
    while (true) {}
  }
})();
