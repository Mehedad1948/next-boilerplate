'use server';

import { testService } from '@/services/test.service';

export async function getTodo(id: string | number) {
  const { result, error, response } = await testService.getOne(id);

  if (error) {
    throw new Error(error || 'Failed to fetch todo');
  }

  return { success: true, message: 'Todo fetched successfully', data: result };
}