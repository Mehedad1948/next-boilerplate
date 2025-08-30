import { WebServices } from './index.service';

class TestServices {
  private webService = new WebServices('/todos');

  getOne(id: string | number) {
    return this.webService.get<any>(`/${id}`);
  }
}

export const testService = new TestServices();
