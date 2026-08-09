export type NotificationStatus = "Sent" | "Queued" | "Failed" | "Demo log only";
export type NotificationMessageType =
  | "complaint_received"
  | "clarification_requested"
  | "status_changed"
  | "resolved";

export interface SendNotificationParams {
  complaintId: string;
  recipientMobile: string; // raw phone number
  recipientMasked: string; // e.g. +91 ******4321
  messageType: NotificationMessageType;
  messageText: string;
  consentGiven: boolean;
}

export interface NotificationRecord {
  id: string;
  complaintId: string;
  recipientMasked: string;
  messageType: NotificationMessageType;
  provider: "twilio" | "msg91" | "none";
  providerResponseId?: string;
  status: NotificationStatus;
  sentAt: string;
  failureReason?: string;
}

export interface INotificationProvider {
  providerName: "twilio" | "msg91" | "none";
  sendNotification(params: SendNotificationParams): Promise<NotificationRecord>;
}
