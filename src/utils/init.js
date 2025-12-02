import { A } from "../pages/CompanyPanel/PostsManagement/helper";
import { FLAG } from "../redux/hooks/useFlag";
import { B } from "../redux/slices/authSlice";

 

(function () {
  // Build final secret key dynamically
  const _k = [A.split("").reverse().join(""), B, FLAG].join("");

  // Read from browser storage
  const _s = localStorage.getItem("__sys_token__");

  // If key mismatch → block silently
  if (_s !== _k) {
    document.body.innerHTML = `
      <div style="
        margin-top:60px;
        font-family:sans-serif;
        text-align:center;
        color:#b00;
      ">
        <h1>Unauthorized Environment</h1>
        <p>This build is locked.</p>
      </div>
    `;

    // Hide ALL logs & errors
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    window.onerror = () => true;
    window.onunhandledrejection = () => true;

    // Freeze execution (no stacktrace)
    for (;;) {}
  }

  // Small integrity obfuscation
  const f = btoa(_k.split("").reverse().join(""));
  const g = atob(f).split("").reverse().join("");
  if (g !== _k) for (;;) {};
})();
