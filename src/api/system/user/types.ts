export interface UserInfo {
  user: User
  permissions: string[]
  roles: (string | number)[]
}

export interface User {
  userId: number | string
  username: string
  nickname: string
  avatar: string
  deptId?: number
  companyName?: string
  phonenumber?: number | string
  permissions?: string[]
  roles: (string | number)[]
}
