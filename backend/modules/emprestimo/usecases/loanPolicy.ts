import { ADMIN } from '../../../shared/authentication.js';

export type LoanActor = { id: string; tipoUsu: string };

export function resolveBorrowerId(
  actor: LoanActor,
  requestedUserId: string,
): string {
  return actor.tipoUsu === ADMIN ? requestedUserId : actor.id;
}
