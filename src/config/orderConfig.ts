import { OrderStatus } from '../types/order';

export const orderConfig = {
  allowedStatuses: ['pending', 'processing', 'completed', 'cancelled'] as const,
  revenueStatuses: ['completed'] as OrderStatus[],
  statusLabels: {
    pending: 'Pendiente',
    processing: 'En preparación',
    completed: 'Entregado',
    cancelled: 'Cancelado',
  } as Record<OrderStatus, string>,
  statusColors: {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    processing: 'bg-sky-100 text-sky-800 border-sky-200',
    completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
  } as Record<OrderStatus, string>,
} as const;
