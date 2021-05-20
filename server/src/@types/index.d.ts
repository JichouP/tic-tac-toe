type User = {
  id: string;
  name: string;
  password: string;
};

declare namespace Express {
  interface Request {
    user: User;
  }
}
