!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? t(exports)
    : "function" == typeof define && define.amd
    ? define(["exports"], t)
    : t(
        ((e =
          "undefined" != typeof globalThis ? globalThis : e || self).AdExSDK =
          {})
      );
})(this, function (e) {
  "use strict";
  const t = {
      id: '62c51d2b-4523-40b9-a6fb-ae4dd50fbf7b"',
      domain: "medium.com",
      defaultFloorPrice: 0.01,
      adSlots: {},
    },
    o = "http://localhost:3003/api/auctions";
  class AdExClient {
    constructor(e = {}) {
      (this.observer = null),
        (this.observedElement = null),
        (this.config = {
          apiUrl: e.apiUrl ?? o,
          timeout: e.timeout ?? 5e3,
          debug: e.debug ?? !1,
          publisherId: e.publisherId,
          domain: e.domain,
          adSlots: e.adSlots,
          selector: e.selector,
          observer: e.observer,
        }),
        (this.publisher = {
          id: this.config.publisherId ?? t.id,
          domain: this.config.domain ?? t.domain,
          defaultFloorPrice: t.defaultFloorPrice ?? 0.01,
          adSlots: { ...t.adSlots, ...this.config.adSlots },
        }),
        (this.defaultAuctionOptions = {
          adSlotType: "banner",
          publisherId: this.publisher.id,
          domain: this.publisher.domain,
        }),
        this.config.debug &&
          console.log("[AdExSDK] Initialized", {
            publisherId: this.publisher.id,
            domain: this.publisher.domain,
            apiUrl: this.config.apiUrl,
            adSlots: Object.keys(this.publisher.adSlots),
          }),
        this.config.selector &&
          "undefined" != typeof window &&
          ("loading" === document.readyState
            ? document.addEventListener("DOMContentLoaded", () =>
                this.autoObserve()
              )
            : this.autoObserve());
    }
    autoObserve() {
      this.config.selector &&
        this.observe({ adSlotType: "banner" }, this.config.selector);
    }
    observe(e, t) {
      if (
        "undefined" == typeof window ||
        "undefined" == typeof IntersectionObserver
      )
        return void (
          this.config.debug &&
          console.warn(
            "[AdExSDK] IntersectionObserver not supported in this environment"
          )
        );
      const o = t ?? this.config.selector;
      if (!o)
        return void (
          this.config.debug &&
          console.error("[AdExSDK] No selector provided for observation")
        );
      const i = document.querySelector(o);
      if (!i)
        return void (
          this.config.debug &&
          console.error(`[AdExSDK] Element not found for selector: "${o}"`)
        );
      this.unobserve(),
        (this.defaultAuctionOptions = e),
        (this.observedElement = i);
      const s = {
        root: this.config.observer?.root ?? null,
        rootMargin: this.config.observer?.rootMargin ?? "0px",
        threshold: this.config.observer?.threshold ?? 0.1,
      };
      (this.observer = new IntersectionObserver((e) => {
        for (const t of e)
          if (t.isIntersecting) {
            this.config.debug &&
              console.log(
                "[AdExSDK] Element entered viewport, triggering auction"
              ),
              this.createAuction(this.defaultAuctionOptions),
              this.unobserve();
            break;
          }
      }, s)),
        this.observer.observe(i),
        this.config.debug && console.log("[AdExSDK] Now observing element:", o);
    }
    unobserve() {
      this.observer &&
        this.observedElement &&
        (this.observer.unobserve(this.observedElement),
        this.observer.disconnect(),
        (this.observer = null),
        (this.observedElement = null),
        this.config.debug && console.log("[AdExSDK] Stopped observing"));
    }
    isObserving() {
      return null !== this.observer;
    }
    async createAuction(e) {
      const t = performance.now(),
        o = e.publisherId ?? this.publisher.id,
        i = e.domain ?? this.publisher.domain;
      let s = e.adSlotId ?? this.publisher.adSlots[e.adSlotType];
      if (!s) {
        const t = {
          auctionId: "",
          status: "rejected",
          createdAt: Date.now(),
          errorCode: "INVALID_AD_SLOT_TYPE",
          errorMessage: `Ad slot type "${e.adSlotType}" not configured. Pass adSlotId directly or configure it in adSlots.`,
          result: void 0,
        };
        return this.config.debug && console.error("[AdExSDK] Error:", t), t;
      }
      const r = e.userContext || this.detectUserContext(),
        n = {
          publisherId: o,
          domain: i,
          adSlotId: s,
          adSlotType: e.adSlotType,
          floorPrice: e.floorPrice ?? this.publisher.defaultFloorPrice ?? 0.01,
          userContext: r,
        };
      this.config.debug && console.log("[AdExSDK] Creating auction:", n);
      try {
        const e = new AbortController(),
          o = setTimeout(() => e.abort(), this.config.timeout),
          i = await fetch(this.config.apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(n),
            signal: e.signal,
          });
        if ((clearTimeout(o), !i.ok))
          throw new Error(`HTTP ${i.status}: ${i.statusText}`);
        const s = await i.json(),
          r = performance.now() - t;
        if (
          (this.config.debug &&
            console.log(`[AdExSDK] Auction created in ${r.toFixed(2)}ms:`, s),
          "accepted" === s.status || (s.auctionId && s.auctionId.length > 0))
        ) {
          const e = await this.fetchAuctionResult(s.auctionId);
          return { ...s, result: e };
        }
        return { ...s, result: void 0 };
      } catch (e) {
        const o = performance.now() - t,
          i = e.message;
        return (
          this.config.debug &&
            console.error(`[AdExSDK] Error after ${o.toFixed(2)}ms:`, i),
          {
            auctionId: "",
            status: "rejected",
            createdAt: Date.now(),
            errorCode: "NETWORK_ERROR",
            errorMessage: i,
            result: void 0,
          }
        );
      }
    }
    detectUserContext() {
      const e = { userAgent: navigator.userAgent },
        t = navigator.language || "en-US";
      e.countryCode = t.split("-")[1]?.toUpperCase() || "US";
      const o = navigator.userAgent;
      return (
        /Mobile|Android|iPhone|iPad/i.test(o)
          ? (e.device = /Tablet|iPad/i.test(o) ? "tablet" : "mobile")
          : (e.device = "desktop"),
        /Windows/i.test(o)
          ? (e.os = "Windows")
          : /Macintosh|Mac OS/i.test(o)
          ? (e.os = "macOS")
          : /Android/i.test(o)
          ? (e.os = "Android")
          : /iOS|iPhone|iPad/i.test(o)
          ? (e.os = "iOS")
          : /Linux/i.test(o) && (e.os = "Linux"),
        /Chrome/i.test(o) && !/Edg|OPR/i.test(o)
          ? (e.browser = "Chrome")
          : /Firefox/i.test(o)
          ? (e.browser = "Firefox")
          : /Safari/i.test(o) && !/Chrome/i.test(o)
          ? (e.browser = "Safari")
          : /Edg/i.test(o)
          ? (e.browser = "Edge")
          : /OPR|Opera/i.test(o) && (e.browser = "Opera"),
        e
      );
    }
    async fetchAuctionResult(e, t) {
      const o = performance.now(),
        i = t?.maxWaitTime ?? 300,
        s = { status: "timeout" },
        r = `${this.config.apiUrl.replace(
          /\/$/,
          ""
        )}/${e}/result?wait=1&timeout=250`,
        n = new AbortController(),
        d = setTimeout(() => n.abort(), i);
      try {
        this.config.debug &&
          console.log("[AdExSDK] Fetching auction result:", {
            auctionId: e,
            resultUrl: r,
          });
        const t = await fetch(r, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: n.signal,
        });
        if ((clearTimeout(d), !t.ok))
          return (
            this.config.debug &&
              console.warn(
                `[AdExSDK] Result fetch returned ${t.status}, returning timeout`
              ),
            s
          );
        const i = await t.json(),
          a = performance.now() - o;
        return (
          this.config.debug &&
            console.log(
              `[AdExSDK] Auction result fetched in ${a.toFixed(2)}ms:`,
              i
            ),
          i
        );
      } catch (e) {
        return (
          clearTimeout(d),
          e instanceof Error && "AbortError" === e.name
            ? (this.config.debug &&
                console.log(
                  "[AdExSDK] Auction result fetch timed out after 300ms"
                ),
              s)
            : (this.config.debug &&
                console.error("[AdExSDK] Error fetching auction result:", e),
              { status: "error" })
        );
      }
    }
    getPublisherConfig() {
      return { ...this.publisher };
    }
    setConfig(e) {
      void 0 !== e.apiUrl && (this.config.apiUrl = e.apiUrl),
        void 0 !== e.timeout && (this.config.timeout = e.timeout),
        void 0 !== e.debug && (this.config.debug = e.debug),
        void 0 !== e.publisherId && (this.publisher.id = e.publisherId),
        void 0 !== e.domain && (this.publisher.domain = e.domain),
        void 0 !== e.adSlots &&
          (this.publisher.adSlots = {
            ...this.publisher.adSlots,
            ...e.adSlots,
          });
    }
  }
  (e.AdExClient = AdExClient),
    (e.DEFAULT_API_URL = o),
    (e.DEFAULT_TIMEOUT = 5e3),
    (e.PUBLISHER_CONFIG = t),
    (e.VERSION = "1.0.0"),
    (e.createAuction = async function (e, t) {
      return new AdExClient().createAuction({ adSlotType: e, ...t });
    });
});
//# sourceMappingURL=adex-sdk.umd.js.map
