export type ClientStatus = 'ACTIVE' | 'INACTIVE';

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  status: ClientStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ClientRequest {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}
