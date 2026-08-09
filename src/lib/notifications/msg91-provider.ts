import crypto from "node:crypto";
import { INotificationProvider, SendNotificationParams, NotificationRecord } from "./provider";

export class MSG91Provider implements INotificationProvider {
  public providerName = "msg91" as const;
  private authKey: string;
  private templateId: string;

  constructor() {
    this.authKey = process.env.MSG91_AUTH_KEY || "";
    this.templateId = process.env.MSG91_TEMPLATE_ID || "";

    if (!this.authKey || !this.templateId) {
      throw new Error("MSG91 configuration missing required environment variables.");
    }
  }

  public async sendNotification(params: SendNotificationParams): Promise<NotificationRecord> {
    const id = `NOTIF-M91-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    const now = new Date().toISOString();

    if (!params.consentGiven) {
      return {
        id,
        complaintId: params.complaintId,
        recipientMasked: params.recipientMasked,
        messageType: params.messageType,
        provider: "msg91",
        status: "Failed",
        sentAt: now,
        failureReason: "Citizen consent was not granted for SMS notifications.",
      };
    }

    try {
      const url = "https://api.msg91.com/api/v5/flow/";
      const cleanMobile = params.recipientMobile.replace(/\D/g, "");
      const formattedMobile = cleanMobile.length === 10 ? `91${cleanMobile}` : cleanMobile;

      const payload = {
        template_id: this.templateId,
        recipients: [
          {
            mobiles: formattedMobile,
            complaint_id: params.complaintId,
            message: params.messageText,
          },
        ],
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          authkey: this.authKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.type === "success") {
        return {
          id,
          complaintId: params.complaintId,
          recipientMasked: params.recipientMasked,
          messageType: params.messageType,
          provider: "msg91",
          providerResponseId: data.message || "msg91_sent",
          status: "Sent",
          sentAt: now,
        };
      } else {
        return {
          id,
          complaintId: params.complaintId,
          recipientMasked: params.recipientMasked,
          messageType: params.messageType,
          provider: "msg91",
          status: "Failed",
          sentAt: now,
          failureReason: data.message || "MSG91 API dispatch failed",
        };
      }
    } catch (err: any) {
      return {
        id,
        complaintId: params.complaintId,
        recipientMasked: params.recipientMasked,
        messageType: params.messageType,
        provider: "msg91",
        status: "Failed",
        sentAt: now,
        failureReason: err?.message || "MSG91 dispatch error",
      };
    }
  }
}
