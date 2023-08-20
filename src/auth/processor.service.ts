import { Injectable } from '@nestjs/common';

@Injectable()
export class ProcessorService {

  filter <T> (array: T [], searchTerm: string,  filterProperties: ((item: T) => string)[] ): T[]{
    const s = searchTerm.toLowerCase();
    return array.filter(item =>
      filterProperties.some(getProperty => {
        const value = getProperty(item).toString().toLowerCase();
        return value.includes(s);
      })
    );
  }
  sort<T>(array: T[], criteria: 'asc' | 'desc'): T[] {
    return array.sort((a: any, b: any) => {
      const diff = a.price - b.price;
      if (diff === 0) return 0;
      const sign = Math.abs(diff) / diff;
      return criteria === 'asc' ? sign : -sign;
    });
  }

  paginate<T>(
    array: T[],
    page: number,
    limit: number,
  ): {
    total: number;
    previous: number;
    last_page: number;
    next: number;
    data: T[];
  } {
    const total = array.length;
    const last_page = Math.ceil(total / limit);
    const previous = page === 1 ? null : page >= last_page ? null : page - 1;
    const next = page === 1 ? null : page >= last_page ? null : page + 1;
    return {
      total,
      previous,
      last_page,
      next,
      data: array.slice((page - 1) * limit, page * limit),
    };
  }
}
