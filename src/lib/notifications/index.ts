import { INotificationProvider } from "./provider";
import { NotificationLogProvider } from "./log-provider";
import { TwilioProvider } from "./twilio-provider";
import { MSG91Provider } from "./msg91-provider";

export function getNotificationProvider(): INotificationProvider {
  const providerType = (process.env.SMS_PROVIDER || "none").toLowerCase().trim();

  if (providerType === "twilio") {
    try {
      return new TwilioProvider();
    } catch (err) {
      console.warn("[Notifications] Twilio configuration error, falling back to log provider:", err);
      return new NotificationLogProvider();
    }
  }

  if (providerType === "msg91") {
    try {
      return new MSG91Provider();
    } catch (err) {
      console.warn("[Notifications] MSG91 configuration error, falling back to log provider:", err);
      return new NotificationLogProvider();
    }
  }

  return new NotificationLogProvider();
}

export const notifier = getNotificationProvider();
