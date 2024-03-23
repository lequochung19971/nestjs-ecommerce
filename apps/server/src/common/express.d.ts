// import { ShoppingSession } from 'src/modules/shopping-carts/entities/shopping-session.entity';

declare namespace Express {
  export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    shoppingSession?: {
      id?: string;
    };
  }
  export interface Request {
    getCsrfToken?: () => string;
    ignoreCsrf?: boolean;
  }
}
