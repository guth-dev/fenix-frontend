export type PaymentMethod = 'CASH' | 'PIX' | 'CARD';
export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: number;
  clientId: number;
  clientName: string;
  courtId: number;
  courtName: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BookingRequest {
  clientId: number;
  courtId: number;
  startTime: string;
  endTime: string;
  paymentMethod: PaymentMethod;
}
