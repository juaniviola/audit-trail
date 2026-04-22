export default interface Filter {
  field: string;
  operator: 'CONTAINS' | 'NOT_CONTAINS' | '=' | '!=' | '>' | '<' | 'IN' | 'NOT_IN';
  value: string | number | boolean;
  type?: 'date' | 'select' | 'number';
}
