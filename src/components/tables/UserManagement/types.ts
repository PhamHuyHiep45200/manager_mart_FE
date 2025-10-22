// Common interface for Employee data
export interface Employee {
  user_id: number;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  role: 'EMPLOYEE' | 'CUSTOMER';
  created_at: string;
  is_locked?: boolean;
}

// Interface for form data (with optional fields)
export interface EmployeeFormData {
  user_id?: number;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  role: 'EMPLOYEE' | 'CUSTOMER';
  password?: string;
  created_at?: string;
  is_locked?: boolean;
}
