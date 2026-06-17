export interface Schema<T> {
  version: number;
  validate(data: unknown): data is T;
  migrate(data: unknown): T;
}

export class SchemaValidator {
  static validate<T>(data: unknown, schema: Schema<T>): T {
    if (schema.validate(data)) {
      return data;
    }
    throw new Error('Invalid data schema');
  }

  static validateOrMigrate<T>(data: unknown, schema: Schema<T>): T {
    try {
      return this.validate(data, schema);
    } catch {
      return schema.migrate(data);
    }
  }
}
