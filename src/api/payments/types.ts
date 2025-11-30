// Payment Status
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

// Payment Method
export type PaymentMethod =
  | 'CASH'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'BANK_TRANSFER'
  | 'MOBILE_PAYMENT'
  | 'OTHER';

// Payment
export interface Payment {
  id: number;
  enrollment: number;
  student_name: string;
  course_group_name: string;
  amount: number;
  payment_date: string; // Date format: YYYY-MM-DD
  status: PaymentStatus;
  payment_method: PaymentMethod;
  reference_number?: string;
  notes?: string;
  recorded_by: number | null;
  recorded_by_name: string;
  created_at: string;
  updated_at: string;
}

// Payment Create
export interface PaymentCreate {
  enrollment: number;
  amount: number;
  payment_date: string;
  status?: PaymentStatus;
  payment_method: PaymentMethod;
  reference_number?: string;
  notes?: string;
}

// Payment Update
export interface PaymentUpdate {
  enrollment?: number;
  amount?: number;
  payment_date?: string;
  status?: PaymentStatus;
  payment_method?: PaymentMethod;
  reference_number?: string;
  notes?: string;
}

// Query params
export interface PaymentListParams {
  enrollment?: number;
  enrollment__course_group?: number;
  status?: PaymentStatus;
  payment_method?: PaymentMethod;
  payment_date?: string;
  search?: string;
  page?: number;
  page_size?: number;
}
