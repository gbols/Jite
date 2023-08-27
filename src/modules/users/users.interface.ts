interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface TokenData {
    token: string;
    expiresIn: number;
  }

interface DataStoredInToken {
    _id: string;
  }
export { User , DataStoredInToken, TokenData};