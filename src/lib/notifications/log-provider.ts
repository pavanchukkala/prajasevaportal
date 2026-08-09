import crypto from "node:crypto";
import { INotificationProvider, SendNotificationParams, NotificationRecord } from "./provider";

export class NotificationLogProvider implements INotificationProvider {
  public providerName = "none" as const;

  public async sendNotification(params: SendNotificationParams): Promise<NotificationRecord> {
    const id = `NOTIF-LOG-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    const now = new Date().toISOString();

    if (!params.consentGiven) {
      return {
        id,
        complaintId: params.complaintId,
        recipientMasked: params.recipientMasked,
        messageType: params.messageType,
        provider: "none",
        status: "Failed",
        sentAt: now,
        failureReason: "Citizen consent was not granted for SMS notifications.",
      };
    }

    return {
      id,
      complaintId: params.complaintId,
      recipientMasked: params.recipientMasked,
      messageType: params.messageType,
      provider: "none",
      providerResponseId: `demo_log_${Date.now()}`,
      status: "Demo log only",
      sentAt: now,
      failureReason: "No external SMS provider configured in environment (SMS_PROVIDER=none). Notification recorded to system audit log.",
    };
  }
}
