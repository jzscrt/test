export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISABLED = 'disabled',
  REVIEW = 'for review',
}

export enum UserRole {
  SU = 'superadmin',
  ADMIN = 'admin',
  USER = 'user',
}

export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
  RESET_PW = 'resetPassword',
}

export enum ClientStatus {
  NOT_SET = 'Not Set',
  AWAITING_GASSIGNMENT = 'Awaiting Assignment',
  PENDING_CHECKLIST = 'Pending Checklists',
  AWAITING_INITIAL = 'Awaiting Initial Report',
  AWAITING_FINAL = 'Awaiting Final Report',
  Q1_REPORT = 'Quarterly Report 1',
  Q2_REPORT = 'Quarterly Report 2',
  Q3_REPORT = 'Quarterly Report 3',
  Q4_REPORT = 'Quarterly Report 4',
}
