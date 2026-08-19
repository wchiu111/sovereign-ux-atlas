export async function transmitContactMessage(formData: FormData): Promise<void> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      website: formData.get("website"),
    }),
  });

  if (response.ok) return;

  let message = "The channel could not complete the transmission.";
  try {
    const body = await response.json() as { error?: { message?: string } };
    if (body.error?.message) message = body.error.message;
  } catch {
    // Keep the safe fallback when the endpoint does not return JSON.
  }
  throw new Error(message);
}
