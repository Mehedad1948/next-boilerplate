import { WebServices } from '.';

class AuthServices {
  private webService = new WebServices('/auth');
}

export const authService = new AuthServices();
