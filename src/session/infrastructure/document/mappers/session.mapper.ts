import { Session } from '../../../domain/session.domain';
import { SessionSchemaClass } from '../entities/session.schema';

export class SessionMapper {
  static toDomain(rawData: SessionSchemaClass): Session {}

  static toPersistence(domainEntity: Session): SessionSchemaClass {}
}
