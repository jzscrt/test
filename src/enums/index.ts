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
