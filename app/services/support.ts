export interface SupportMessage {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export type SupportSubmission = { status: "unavailable"; message: string } | { status: "sent" };

/**
 * Support messages — NOT CONNECTED.
 *
 * No support channel has been set up yet, so the message is not sent, logged or
 * stored. Replace the body with `POST /support/messages` once it exists.
 */
export async function sendSupportMessage(_message: SupportMessage): Promise<SupportSubmission> {
  return {
    status: "unavailable",
    message:
      "Messages cannot be sent yet: the support service is not connected. Nothing you entered was sent or saved.",
  };
}
