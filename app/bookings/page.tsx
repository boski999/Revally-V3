'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  CalendarCheck
} from 'lucide-react';
import { useReservations } from '@/hooks/use-reservations';
import { useStores } from '@/hooks/use-stores';
import { useLanguage } from '@/contexts/language-context';
import { ReservationCard } from '@/components/reservation-card';
import { ReservationStatus } from '@/types';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday } from 'date-fns';
import { cn } from '@/lib/utils';

export default function BookingsPage() {
  const { t } = useLanguage();
  const { activeStore } = useStores();
  const { reservations, stats, loading, updateReservationStatus } = useReservations(activeStore?.id);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reservation.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reservation.customer_phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const reservationsByDate = filteredReservations.reduce((acc, reservation) => {
    const date = reservation.reservation_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(reservation);
    return acc;
  }, {} as Record<string, typeof reservations>);

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const statsCards = [
    {
      title: 'Today',
      value: stats.today,
      icon: CalendarCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
    },
    {
      title: 'Confirmed',
      value: stats.confirmed,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
    },
    {
      title: 'Occupancy',
      value: `${stats.occupancyRate}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-950/50 dark:to-gray-900">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Reservations
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage table bookings for {activeStore?.name}
          </p>
        </div>

        <Button className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25">
          <Plus className="w-4 h-4" />
          New Reservation
        </Button>
      </div>

      {/* Calendar Overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <CardTitle className="text-lg">
                {format(selectedDate, 'MMMM yyyy')}
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-xs text-muted-foreground">Pending</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-muted-foreground">Confirmed</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-7 gap-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="text-center font-semibold text-xs text-muted-foreground py-1">
                {day}
              </div>
            ))}

            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {daysInMonth.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const dayReservations = reservationsByDate[dateStr] || [];
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, selectedDate);
              const isTodayDate = isToday(day);

              const hasPending = dayReservations.some(r => r.status === 'pending');
              const hasConfirmed = dayReservations.some(r => r.status === 'confirmed');

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    'relative h-10 rounded-md border transition-all duration-200 hover:border-blue-500 hover:shadow-sm',
                    isSelected && 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 ring-1 ring-blue-500',
                    !isCurrentMonth && 'opacity-30',
                    isTodayDate && 'font-bold border-blue-400',
                    !isSelected && !isTodayDate && 'border-gray-200 dark:border-gray-700'
                  )}
                >
                  <div className="relative z-10 flex flex-col items-center justify-center h-full">
                    <div className="text-xs font-medium">{format(day, 'd')}</div>
                    {dayReservations.length > 0 && (
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {hasPending && (
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                        )}
                        {hasConfirmed && (
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        )}
                      </div>
                    )}
                  </div>
                  {dayReservations.length > 0 && (
                    <div
                      className="absolute inset-0 opacity-5 rounded-md"
                      style={{
                        background: hasConfirmed
                          ? '#22c55e'
                          : hasPending
                          ? '#f97316'
                          : '#3b82f6'
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={cn('p-3 rounded-xl', stat.bgColor)}>
                  <stat.icon className={cn('w-6 h-6', stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <CardTitle>All Reservations</CardTitle>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ReservationStatus | 'all')}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="seated">Seated</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no_show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {filteredReservations.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No reservations found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Create your first reservation to get started'}
                </p>
              </div>
            ) : (
              filteredReservations.map(reservation => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onStatusUpdate={updateReservationStatus}
                  compact
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}