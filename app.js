// Copyright (c) 2026 SolPulseData. All Rights Reserved.
// Front-end for the SolPulseData static site. Calls only the public API and holds no secrets.
(function () {
  "use strict";

  var API_BASE_URL = "https://solpulsedata.duckdns.org";

  function setStatus(text, cls, detail) {
    var el = document.getElementById("status");
    el.textContent = text;
    el.className = cls || "muted";
    var d = document.getElementById("status-detail");
    if (d) d.textContent = detail || "";
  }

  function getJson(path) {
    return fetch(API_BASE_URL + path, { headers: { Accept: "application/json" } }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    });
  }

  getJson("/health")
    .then(function (h) {
      setStatus(
        "Online",
        "ok",
        "Candle timeframe " + (h.candle_timeframe || "1h") + ". Payment gate " +
          (h.payment_gate_enabled ? "enabled" : "disabled (testing)") + "."
      );
    })
    .catch(function () {
      setStatus("Unreachable", "warn", "The API did not respond. Try again later.");
    });

  getJson("/v1/sample")
    .then(function (s) {
      document.getElementById("sample").textContent = JSON.stringify(s, null, 2);
    })
    .catch(function () {
      document.getElementById("sample").textContent = "Sample unavailable right now.";
    });
}());
