import crypto from "node:crypto";
import { INotificationProvider, SendNotificationParams, NotificationRecord } from "./provider";

export class TwilioProvider implements INotificationProvider {
  public providerName = "twilio" as const;
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || "";
    this.authToken = process.env.TWILIO_AUTH_TOKEN || "";
    this.fromNumber = process.env.TWILIO_FROM_NUMBER || "";

    if (!this.accountSid || !this.authToken || !this.fromNumber) {
      throw new Error("Twilio configuration missing required environment variables.");
    }
  }

  public async sendNotification(params: SendNotificationParams): Promise<NotificationRecord> {
    const id = `NOTIF-TW-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    const now = new Date().toISOString();

    if (!params.consentGiven) {
      return {
        id,
        complaintId: params.complaintId,
        recipientMasked: params.recipientMasked,
        messageType: params.messageType,
        provider: "twilio",
        status: "Failed",
        sentAt: now,
        failureReason: "Citizen consent was not granted for SMS notifications.",
      };
    }

    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
      const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString("base64");

      const bodyParams = new URLSearchParams();
      bodyParams.append("To", params.recipientMobile.startsWith("+") ? params.recipientMobile : `+91${params.recipientMobile}`);
      bodyParams.append("From", this.fromNumber);
      bodyParams.append("Body", params.messageText);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: bodyParams.toString(),
      });

      const data = await res.json();

      if (res.ok && data.sid) {
        return {
          id,
          complaintId: params.complaintId,
          recipientMasked: params.recipientMasked,
          messageType: params.messageType,
          provider: "twilio",
          providerResponseId: data.sid,
          status: "Sent",
          sentAt: now,
        };
      } else {
        return {
          id,
          complaintId: params.complaintId,
          recipientMasked: params.recipientMasked,
          messageType: params.messageType,
          provider: "twilio",
          status: "Failed",
          sentAt: now,
          failureReason: data.message || "Twilio API dispatch failed",
        };
      }
    } catch (err: any) {
      return {
        id,
        complaintId: params.complaintId,
        recipientMasked: params.recipientMasked,
        messageType: params.messageType,
        provider: "twilio",
        status: "Failed",
        sentAt: now,
        failureReason: err?.message || "Twilio dispatch error",
      };
    }
  }
}
