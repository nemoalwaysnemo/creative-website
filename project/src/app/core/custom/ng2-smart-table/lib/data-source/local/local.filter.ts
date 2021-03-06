/* eslint-disable prefer-arrow/prefer-arrow-functions */
export function filterValues(value: string, search: string): boolean {
  return value.toString().toLowerCase().includes(search.toString().toLowerCase());
}

export class LocalFilter {

  static filter(data: any[], field: string, search: string, customFilter?: () => any): any[] {
    const filter = customFilter ? customFilter : filterValues;

    return data.filter((el) => {
      const value = typeof el[field] === 'undefined' || el[field] === null ? '' : el[field];
      return filter.call(null, value, search);
    });
  }
}
