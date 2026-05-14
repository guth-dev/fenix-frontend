export type CourtStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

export interface Court {
  id: number;
  name: string;
  description: string;
  sportType: string;
  pricePerHour: number;
  status: CourtStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CourtRequest {
  name: string;
  description: string;
  sportType: string;
  pricePerHour: number;
}
