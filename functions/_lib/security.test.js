import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  isAllowedHost,
  isAllowedOrigin,
  isLocalHost,
  isUuid,
  json,
  readJsonLimited,
  stripCors,
} from "./security.js";

function req(url, headers = {}) {
  return new Request(url, { headers });
}

describe("host allowlist", () => {
  it("allows apex and www", () => {
    assert.equal(isAllowedHost(req("https://jasonwpalmer.com/api/subscribe")), true);
    assert.equal(isAllowedHost(req("https://www.jasonwpalmer.com/api/subscribe")), true);
  });

  it("allows localhost for wrangler pages dev", () => {
    assert.equal(isLocalHost("localhost"), true);
    assert.equal(isAllowedHost(req("http://localhost:8788/api/subscribe")), true);
  });

  it("rejects pages.dev and other hosts", () => {
    assert.equal(isAllowedHost(req("https://jasonwpalmer-com.pages.dev/api/subscribe")), false);
    assert.equal(
      isAllowedHost(req("https://abc123.jasonwpalmer-com.pages.dev/api/subscribe")),
      false
    );
    assert.equal(isAllowedHost(req("https://evil.example/api/subscribe")), false);
  });
});

describe("origin allowlist", () => {
  it("allows matching Origin on apex", () => {
    assert.equal(
      isAllowedOrigin(
        req("https://jasonwpalmer.com/api/subscribe", {
          Origin: "https://jasonwpalmer.com",
        })
      ),
      true
    );
  });

  it("rejects foreign Origin", () => {
    assert.equal(
      isAllowedOrigin(
        req("https://jasonwpalmer.com/api/subscribe", {
          Origin: "https://evil.example",
        })
      ),
      false
    );
  });

  it("rejects pages.dev Origin even against apex host", () => {
    assert.equal(
      isAllowedOrigin(
        req("https://jasonwpalmer.com/api/subscribe", {
          Origin: "https://jasonwpalmer-com.pages.dev",
        })
      ),
      false
    );
  });

  it("rejects missing Origin and Referer on apex", () => {
    assert.equal(isAllowedOrigin(req("https://jasonwpalmer.com/api/subscribe")), false);
  });

  it("accepts Referer fallback", () => {
    assert.equal(
      isAllowedOrigin(
        req("https://jasonwpalmer.com/api/subscribe", {
          Referer: "https://jasonwpalmer.com/",
        })
      ),
      true
    );
  });
});

describe("uuid and json helpers", () => {
  it("accepts a v4 UUID and rejects junk", () => {
    assert.equal(isUuid("2c1a0f3e-8b47-4d2a-9c1b-0a1b2c3d4e5f"), true);
    assert.equal(isUuid(""), false);
    assert.equal(isUuid("not-a-token"), false);
    assert.equal(isUuid("2c1a0f3e-8b47-4d2a-9c1b-0a1b2c3d4e5f' OR 1=1"), false);
  });

  it("caps JSON body size and requires objects", async () => {
    const big = new Request("https://jasonwpalmer.com/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "x".repeat(5000),
    });
    const limited = await readJsonLimited(big, 4096);
    assert.equal(limited.ok, false);
    assert.equal(limited.status, 413);

    const ok = await readJsonLimited(
      new Request("https://jasonwpalmer.com/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "a@b.co" }),
      })
    );
    assert.equal(ok.ok, true);
    assert.equal(ok.data.email, "a@b.co");
  });

  it("never sets CORS on JSON responses", () => {
    const res = json({ ok: true }, 200);
    assert.equal(res.headers.get("Access-Control-Allow-Origin"), null);
    assert.equal(res.headers.get("X-Content-Type-Options"), "nosniff");
    assert.equal(res.headers.get("Cache-Control"), "no-store");
  });

  it("strips CORS headers", () => {
    const headers = new Headers({ "Access-Control-Allow-Origin": "*" });
    stripCors(headers);
    assert.equal(headers.get("Access-Control-Allow-Origin"), null);
  });
});
