export type InquiryStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'FOLLOW_UP'
  | 'CONVERTED'
  | 'NOT_INTERESTED'
  | 'CLOSED';

export type InquirySource =
  | 'WEBSITE'
  | 'PHONE'
  | 'EMAIL'
  | 'REFERRAL'
  | 'SOCIAL_MEDIA'
  | 'WALK_IN'
  | 'OTHER';

export interface Inquiry {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  address: string | null;
  interested_courses: number[];
  interested_course_names: string;
  interested_course_groups: number[];
  interested_group_names: string;
  branch: number | null;
  branch_name: string;
  status: InquiryStatus;
  source: InquirySource;
  assigned_to: number | null;
  assigned_to_name: string;
  follow_up_date: string | null;
  notes: string | null;
  preferred_start_date: string | null;
  budget: string | null;
  converted_to_student: number | null;
  converted_to_student_name: string;
  conversion_date: string | null;
  is_converted: string;
  days_since_inquiry: string;
  inquiry_date: string;
  created_at: string;
  updated_at: string;
}

export interface InquiryCreate {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string | null;
  address?: string | null;
  interested_courses?: number[];
  interested_course_groups?: number[];
  branch?: number | null;
  status?: InquiryStatus;
  source?: InquirySource;
  assigned_to?: number | null;
  follow_up_date?: string | null;
  notes?: string | null;
  preferred_start_date?: string | null;
  budget?: string | null;
}

export interface InquiryUpdate {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string | null;
  address?: string | null;
  interested_courses?: number[];
  interested_course_groups?: number[];
  branch?: number | null;
  status?: InquiryStatus;
  source?: InquirySource;
  assigned_to?: number | null;
  follow_up_date?: string | null;
  notes?: string | null;
  preferred_start_date?: string | null;
  budget?: string | null;
}

export interface InquiryListParams {
  assigned_to?: number;
  branch?: number;
  search?: string;
  source?: InquirySource;
  status?: InquiryStatus;
  page?: number;
  page_size?: number;
}

export interface InquiryAssignRequest {
  assigned_to: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type InquiryConvertRequest = {};
