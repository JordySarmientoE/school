export class UserResponseDto {
  id: string;
  firstName: string;
  email: string;
  password: string;
  status: string;
  created_at: Date;
  updated_at: Date;

  constructor(payload) {
    Object.assign(this, payload);
  }

  removePassword() {
    delete this.password;
  }
}
