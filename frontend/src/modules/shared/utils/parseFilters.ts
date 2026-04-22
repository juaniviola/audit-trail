import Filter from '../domain/filter';

export default function parseFilters(filters: Filter[]): string {
  if (!filters.length) return '';
  const cleaned = filters.map((f) => ({ field: f.field, operator: f.operator, value: f.value }));
  return `filters=${encodeURIComponent(JSON.stringify(cleaned))}`;
}
