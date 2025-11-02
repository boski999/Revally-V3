'use client';

import { useState, useEffect } from 'react';
import { Reservation, ReservationStatus, ReservationStats } from '@/types';
import { addDays, format, startOfDay, endOfDay, isToday, isFuture, parseISO } from 'date-fns';

export function useReservations(storeId?: string) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [stats, setStats] = useState<ReservationStats>({
    total: 0,
    today: 0,
    upcoming: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    noShow: 0,
    averagePartySize: 0,
    occupancyRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!storeId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        await new Promise(resolve => setTimeout(resolve, 800));

        const mockReservations = generateMockReservations(storeId);
        setReservations(mockReservations);
        setStats(calculateStats(mockReservations));
      } catch (err) {
        setError('Failed to load reservations');
        console.error('Error loading reservations:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [storeId]);

  const loadReservations = async () => {
    if (!storeId) return;

    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockReservations = generateMockReservations(storeId);
      setReservations(mockReservations);
      setStats(calculateStats(mockReservations));
    } catch (err) {
      setError('Failed to load reservations');
      console.error('Error loading reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (id: string, status: ReservationStatus) => {
    try {
      setReservations(prev =>
        prev.map(res =>
          res.id === id
            ? { ...res, status, updated_at: new Date().toISOString() }
            : res
        )
      );

      const updatedReservations = reservations.map(res =>
        res.id === id ? { ...res, status } : res
      );
      setStats(calculateStats(updatedReservations));

      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      console.error('Error updating reservation:', err);
      throw err;
    }
  };

  const createReservation = async (data: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newReservation: Reservation = {
        ...data,
        id: `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await new Promise(resolve => setTimeout(resolve, 500));

      setReservations(prev => [newReservation, ...prev]);
      setStats(calculateStats([newReservation, ...reservations]));

      return newReservation;
    } catch (err) {
      console.error('Error creating reservation:', err);
      throw err;
    }
  };

  const deleteReservation = async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      setReservations(prev => prev.filter(res => res.id !== id));
      const updatedReservations = reservations.filter(res => res.id !== id);
      setStats(calculateStats(updatedReservations));
    } catch (err) {
      console.error('Error deleting reservation:', err);
      throw err;
    }
  };

  return {
    reservations,
    stats,
    loading,
    error,
    updateReservationStatus,
    createReservation,
    deleteReservation,
    refresh: loadReservations,
  };
}

function generateMockReservations(storeId: string): Reservation[] {
  const today = new Date();
  const reservations: Reservation[] = [];
  const names = [
    'John Smith', 'Emma Johnson', 'Michael Brown', 'Sophia Davis', 'James Wilson',
    'Olivia Martinez', 'William Anderson', 'Ava Taylor', 'Robert Thomas', 'Isabella Moore',
    'David Jackson', 'Mia White', 'Richard Harris', 'Charlotte Martin', 'Joseph Thompson',
  ];

  const times = ['11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'];
  const statuses: ReservationStatus[] = ['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show'];
  const specialRequests = [
    'Window seat preferred',
    'Birthday celebration - please prepare a dessert',
    'High chair needed',
    'Gluten-free options required',
    'Quiet area preferred',
    'Celebrating anniversary',
    null,
    null,
    null,
  ];

  for (let i = 0; i < 35; i++) {
    const daysOffset = Math.floor(Math.random() * 14) - 7;
    const reservationDate = addDays(today, daysOffset);
    const isPast = daysOffset < 0;

    let status: ReservationStatus;
    if (isPast) {
      const pastStatuses: ReservationStatus[] = ['completed', 'no_show', 'cancelled'];
      status = pastStatuses[Math.floor(Math.random() * pastStatuses.length)];
    } else if (daysOffset === 0) {
      const todayStatuses: ReservationStatus[] = ['pending', 'confirmed', 'seated'];
      status = todayStatuses[Math.floor(Math.random() * todayStatuses.length)];
    } else {
      const futureStatuses: ReservationStatus[] = ['pending', 'confirmed'];
      status = futureStatuses[Math.floor(Math.random() * futureStatuses.length)];
    }

    const name = names[Math.floor(Math.random() * names.length)];
    const partySize = Math.floor(Math.random() * 8) + 2;
    const time = times[Math.floor(Math.random() * times.length)];
    const hasTable = status === 'confirmed' || status === 'seated' || status === 'completed';
    const specialRequest = specialRequests[Math.floor(Math.random() * specialRequests.length)];

    reservations.push({
      id: `res_${storeId}_${i}`,
      store_id: storeId,
      customer_name: name,
      customer_email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      customer_phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      party_size: partySize,
      reservation_date: format(reservationDate, 'yyyy-MM-dd'),
      reservation_time: time,
      special_requests: specialRequest || undefined,
      status,
      table_number: hasTable ? `${Math.floor(Math.random() * 20) + 1}` : undefined,
      created_at: addDays(reservationDate, -Math.floor(Math.random() * 7)).toISOString(),
      updated_at: new Date().toISOString(),
      is_recurring: Math.random() > 0.9,
      recurring_pattern: Math.random() > 0.9 ? 'Weekly' : undefined,
    });
  }

  return reservations.sort((a, b) => {
    const dateA = new Date(`${a.reservation_date} ${a.reservation_time}`);
    const dateB = new Date(`${b.reservation_date} ${b.reservation_time}`);
    return dateB.getTime() - dateA.getTime();
  });
}

function calculateStats(reservations: Reservation[]): ReservationStats {
  const today = startOfDay(new Date());

  const todayReservations = reservations.filter(r => {
    const resDate = parseISO(r.reservation_date);
    return isToday(resDate);
  });

  const upcomingReservations = reservations.filter(r => {
    const resDate = parseISO(r.reservation_date);
    return isFuture(resDate);
  });

  const statusCounts = reservations.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<ReservationStatus, number>);

  const totalPartySize = reservations.reduce((sum, r) => sum + r.party_size, 0);
  const averagePartySize = reservations.length > 0 ? totalPartySize / reservations.length : 0;

  const totalCapacity = 100;
  const todayOccupancy = todayReservations.reduce((sum, r) => sum + r.party_size, 0);
  const occupancyRate = (todayOccupancy / totalCapacity) * 100;

  return {
    total: reservations.length,
    today: todayReservations.length,
    upcoming: upcomingReservations.length,
    pending: statusCounts.pending || 0,
    confirmed: statusCounts.confirmed || 0,
    completed: statusCounts.completed || 0,
    cancelled: statusCounts.cancelled || 0,
    noShow: statusCounts.no_show || 0,
    averagePartySize: Math.round(averagePartySize * 10) / 10,
    occupancyRate: Math.round(occupancyRate),
  };
}