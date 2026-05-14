export interface Card {
  id: string;
  holder: string;
  uid: string;
  last4: string;
  type: string;
  status: "Active" | "Blocked" | "Frozen" | "Cancelled";
  limit: string;
  cashLimit: string;
  issued: string;
  expiry: string;
  delivery: string;
  pinReset: boolean;
}
