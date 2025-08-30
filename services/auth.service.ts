import { WebServices } from './index.service';

class AuthServices {
  private webService = new WebServices('/auth');
}

export const authService = new AuthServices();
