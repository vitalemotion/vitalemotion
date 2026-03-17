const EXCHANGE_RATE_API_URL =
  process.env.EXCHANGE_RATE_API_URL || "https://open.er-api.com/v6/latest/USD";
const EXCHANGE_RATE_CACHE_MS = Number(
  process.env.EXCHANGE_RATE_CACHE_MS || "3600000"
);
const FALLBACK_COP_PER_USD = Number(process.env.PAYPAL_COP_TO_USD_RATE || "4000");

interface ExchangeRateCache {
  expiresAt: number;
  value: number;
}

let cachedCopPerUsdRate: ExchangeRateCache | null = null;

function parseCopPerUsdRate(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const data = payload as {
    base?: string;
    base_code?: string;
    rates?: Record<string, number>;
    conversion_rates?: Record<string, number>;
  };

  if (data.base === "USD" && typeof data.rates?.COP === "number") {
    return data.rates.COP;
  }

  if (data.base === "COP" && typeof data.rates?.USD === "number") {
    return 1 / data.rates.USD;
  }

  if (
    data.base_code === "USD" &&
    typeof data.conversion_rates?.COP === "number"
  ) {
    return data.conversion_rates.COP;
  }

  if (
    data.base_code === "COP" &&
    typeof data.conversion_rates?.USD === "number"
  ) {
    return 1 / data.conversion_rates.USD;
  }

  return null;
}

async function fetchWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function getCopPerUsdRate() {
  if (cachedCopPerUsdRate && Date.now() < cachedCopPerUsdRate.expiresAt) {
    return cachedCopPerUsdRate.value;
  }

  try {
    const response = await fetchWithTimeout(EXCHANGE_RATE_API_URL, 5000);

    if (!response.ok) {
      throw new Error(`EXCHANGE_RATE_REQUEST_FAILED:${response.status}`);
    }

    const payload = (await response.json()) as unknown;
    const liveRate = parseCopPerUsdRate(payload);

    if (!liveRate || !Number.isFinite(liveRate) || liveRate <= 0) {
      throw new Error("EXCHANGE_RATE_INVALID_RESPONSE");
    }

    cachedCopPerUsdRate = {
      value: liveRate,
      expiresAt: Date.now() + EXCHANGE_RATE_CACHE_MS,
    };

    return liveRate;
  } catch (error) {
    console.warn(
      "[Exchange Rate] Falling back to configured COP/USD rate:",
      error
    );

    cachedCopPerUsdRate = {
      value: FALLBACK_COP_PER_USD,
      expiresAt: Date.now() + 60_000,
    };

    return FALLBACK_COP_PER_USD;
  }
}
