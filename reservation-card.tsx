'use client';

import { Reservation, ReservationStatus } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Phone, Mail, MessageSquare, Check, X, UserCheck, CircleDashed } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ReservationCardProps {
  reservation: Reservation;
  onStatusUpdate: (id: string, status: ReservationStatus) => void;
  compact?: boolean;
}

const statusConfig: Record<ReservationStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
  pending: { label: 'Pending', variant: 'outline', color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30' },
  confirmed: { label: 'Confirmed', variant: 'default', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30' },
  seated: { label: 'Seated', variant: 'secondary', color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/30' },
  completed: { label: 'Completed', variant: 'secondary', color: 'text-green-600 bg-green-50 dark:bg-green-950/30' },
  cancelled: { label: 'Cancelled', variant: 'destructive', color: 'text-red-600 bg-red-50 dark:bg-red-950/30' },
  no_show: { label: 'No Show', variant: 'destructive', color: 'text-gray-600 bg-gray-50 dark:bg-gray-950/30' },
};

export function ReservationCard({ reservation, onStatusUpdate, compact = false }: ReservationCardProps) {
  const statusInfo = statusConfig[reservation.status];

  const date = new Date(reservation.reservation_date);
  const formattedDate = format(date, 'MMM dd, yyyy');

  const getActionButtons = () => {
    switch (reservation.status) {
      case 'pending':
        return (
          <>
            <Button
              size="sm"
              variant="default"
              className="gap-2"
              onClick={() => onStatusUpdate(reservation.id, 'confirmed')}
            >
              <Check className="w-4 h-4" />
              Confirm
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => onStatusUpdate(reservation.id, 'cancelled')}
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </>
        );
      case 'confirmed':
        return (
          <>
            <Button
              size="sm"
              variant="default"
              className="gap-2"
              onClick={() => onStatusUpdate(reservation.id, 'seated')}
            >
              <UserCheck className="w-4 h-4" />
              Seat
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => onStatusUpdate(reservation.id, 'no_show')}
            >
              <CircleDashed className="w-4 h-4" />
              No Show
            </Button>
          </>
        );
      case 'seated':
        return (
          <Button
            size="sm"
            variant="default"
            className="gap-2"
            onClick={() => onStatusUpdate(reservation.id, 'completed')}
          >
            <Check className="w-4 h-4" />
            Complete
          </Button>
        );
      default:
        return null;
    }
  };

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="flex flex-col items-center justify-center p-2 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 rounded-lg">
                <div className="text-xs text-muted-foreground">{format(date, 'MMM')}</div>
                <div className="text-lg font-bold">{format(date, 'dd')}</div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold truncate">{reservation.customer_name}</h4>
                  <Badge className={cn('shrink-0', statusInfo.color)}>
                    {statusInfo.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {reservation.reservation_time}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {reservation.party_size} guests
                  </div>
                  {reservation.table_number && (
                    <div className="font-medium text-foreground">
                      Table {reservation.table_number}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {getActionButtons()}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4" style={{ borderLeftColor: statusInfo.color.includes('blue') ? '#3b82f6' : statusInfo.color.includes('green') ? '#22c55e' : statusInfo.color.includes('yellow') ? '#eab308' : statusInfo.color.includes('red') ? '#ef4444' : '#6b7280' }}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold">{reservation.customer_name}</h3>
              <Badge className={cn('shrink-0', statusInfo.color)}>
                {statusInfo.label}
              </Badge>
              {reservation.is_recurring && (
                <Badge variant="outline" className="shrink-0">
                  Recurring
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>{formattedDate}</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 text-green-500" />
                <span>{reservation.reservation_time}</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4 text-purple-500" />
                <span>{reservation.party_size} guests</span>
              </div>

              {reservation.table_number && (
                <div className="flex items-center gap-2 font-medium">
                  <span className="text-muted-foreground">Table:</span>
                  <span>{reservation.table_number}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <a href={`tel:${reservation.customer_phone}`} className="hover:underline">
              {reservation.customer_phone}
            </a>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <a href={`mailto:${reservation.customer_email}`} className="hover:underline truncate">
              {reservation.customer_email}
            </a>
          </div>
        </div>

        {reservation.special_requests && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
            <div className="flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-medium text-amber-900 dark:text-amber-200 mb-1">Special Requests</div>
                <p className="text-sm text-amber-800 dark:text-amber-300">{reservation.special_requests}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            Booked {format(new Date(reservation.created_at), 'MMM dd, yyyy • hh:mm a')}
          </div>

          <div className="flex items-center gap-2">
            {getActionButtons()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}