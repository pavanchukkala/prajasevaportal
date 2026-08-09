# NOTIFICATION_STATUS.md — SMS & Notification Dispatch Audit Report

**Date:** 2026-08-09  
**Status:** ✅ COMPLETED & VERIFIED

---

## 1. Notification Provider Architecture

The notification system follows a provider pattern (`INotificationProvider`) driven by the `SMS_PROVIDER` environment variable:

| Provider | Trigger Condition | Delivery Status | Notes |
| :--- | :--- | :--- | :--- |
| **Twilio** | `SMS_PROVIDER=twilio` | `Sent` \| `Failed` | Dispatches real SMS via Twilio REST API |
| **MSG91** | `SMS_PROVIDER=msg91` | `Sent` \| `Failed` | Dispatches real SMS via MSG91 Flow API |
| **NotificationLog** | `SMS_PROVIDER=none` | `Demo log only` | Writes to database audit log (`notificationLog`) without claiming SMS delivery |

---

## 2. Notification Audit & Privacy Rules

1. **Explicit Citizen Consent Required**: SMS notifications are dispatched **only** when the citizen explicitly checks the consent box during complaint submission.
2. **Strict Purpose Restriction**: Only complaint-related transactional notices are permitted:
   - `complaint_received`: Immediate submission confirmation & tracking token receipt.
   - `clarification_requested`: Request for additional evidence or details.
   - `status_changed`: Notice when staff update complaint status (`Under Review`, `Assigned`, etc.).
   - `resolved`: Final resolution notification.
   - **Zero Promotional / Political Messages**: No advertising, political statements, or promotional content.
3. **Staff View Masking**: All staff interfaces display masked numbers (`+91 ******4321`). Raw mobile numbers are never rendered on public UI views or returned in public API payloads.
4. **Notification Audit Schema**:
```json
{
  "id": "NOTIF-1786270800000-f1e2d3",
  "complaintId": "SKT-2026-25175",
  "recipientMasked": "+91 ******3210",
  "messageType": "status_changed",
  "provider": "none",
  "providerResponseId": "demo_log_1786270800000",
  "status": "Demo log only",
  "sentAt": "2026-08-09T15:20:56.000Z",
  "failureReason": "No external SMS provider configured in environment (SMS_PROVIDER=none). Notification recorded to system audit log."
}
```
