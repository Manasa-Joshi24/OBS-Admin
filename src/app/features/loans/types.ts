export interface Loan {
  id: string;
  applicant: string;
  uid: string;
  type: string;
  amount: string;
  disbursed: string;
  term: string;
  emi: string;
  rate: string;
  status: "Active" | "Overdue" | "Pending Approval" | "Closed" | "Under Review";
  overdue: boolean;
  nextEmi: string;
  progress: number;
}
