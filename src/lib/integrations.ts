export class IntegrationError extends Error {
  status: number;
  code: string;

  constructor(code: string, message: string, status = 503) {
    super(message);
    this.name = "IntegrationError";
    this.code = code;
    this.status = status;
  }
}

export function isMockIntegrationModeEnabled() {
  return process.env.ALLOW_MOCK_INTEGRATIONS === "true";
}

export function isMockSchedulingDataEnabled() {
  return process.env.ALLOW_MOCK_SCHEDULING_DATA === "true";
}
