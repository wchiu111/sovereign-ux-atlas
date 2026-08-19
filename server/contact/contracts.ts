export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export class ContactValidationError extends Error {}

function requiredText(
  value: unknown,
  label: string,
  maxLength: number,
): string {
  if (typeof value !== "string") {
    throw new ContactValidationError(`${label} is required.`);
  }
  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) {
    throw new ContactValidationError(`${label} is invalid.`);
  }
  return normalized;
}

export function validateContactMessage(value: unknown): ContactMessage {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ContactValidationError("The contact request is invalid.");
  }
  const input = value as Record<string, unknown>;
  if (typeof input.website === "string" && input.website.trim()) {
    throw new ContactValidationError("The contact request is invalid.");
  }

  const email = requiredText(input.email, "Email", 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ContactValidationError("Email is invalid.");
  }

  return {
    name: requiredText(input.name, "Name", 100),
    email,
    message: requiredText(input.message, "Message", 5_000),
  };
}
