import { getPrisma } from '../database/database';
import { v4 as uuidv4 } from 'uuid';

export interface CreateBookingInput {
  clientName: string;
  clientPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  paid: boolean;
  notes?: string;
  bookingNumber?: string;
}

export interface BookingFilter {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export class BookingService {
  static generateBookingNumber(): string {
    const prefix = 'STD';
    const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${datePart}-${randomPart}`;
  }

  static async create(data: CreateBookingInput) {
    const prisma = getPrisma();
    let bookingNumber = data.bookingNumber;

    if (bookingNumber) {
      const existing = await prisma.booking.findUnique({ where: { bookingNumber } });
      if (existing) {
        throw new Error('Booking number already exists. Please use a different one.');
      }
    } else {
      bookingNumber = this.generateBookingNumber();
    }

    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        date: new Date(data.date),
        startTime: data.startTime,
        endTime: data.endTime,
        price: data.price,
        paid: data.paid,
        notes: data.notes || '',
        status: 'confirmed',
      },
    });

    return booking;
  }

  static async getAll(filters?: BookingFilter) {
    const prisma = getPrisma();
    const where: any = {};

    if (filters?.search) {
      where.OR = [
        { clientName: { contains: filters.search } },
        { clientPhone: { contains: filters.search } },
        { bookingNumber: { contains: filters.search } },
      ];
    }

    if (filters?.dateFrom || filters?.dateTo) {
      where.date = {};
      if (filters.dateFrom) {
        where.date.gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        where.date.lte = new Date(filters.dateTo);
      }
    }

    return prisma.booking.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  static async getByDate(date: string) {
    const prisma = getPrisma();
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.booking.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  static async getById(id: string) {
    const prisma = getPrisma();
    return prisma.booking.findUnique({ where: { id } });
  }

  static async getByBookingNumber(bookingNumber: string) {
    const prisma = getPrisma();
    return prisma.booking.findUnique({ where: { bookingNumber } });
  }

  static async cancel(id: string) {
    const prisma = getPrisma();
    return prisma.booking.update({
      where: { id },
      data: { status: 'cancelled' },
    });
  }

  static async delete(id: string) {
    const prisma = getPrisma();
    return prisma.booking.delete({ where: { id } });
  }

  static async updateReceiptPath(id: string, receiptPath: string) {
    const prisma = getPrisma();
    return prisma.booking.update({
      where: { id },
      data: { receiptPath },
    });
  }

  static async getMonthlyReport(year: number, month: number) {
    const prisma = getPrisma();
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        status: { not: 'cancelled' },
      },
      orderBy: { date: 'asc' },
    });

    const totalRevenue = bookings.reduce((sum, b) => sum + b.price, 0);
    const uniqueClients = new Set(bookings.map((b) => b.clientName)).size;

    const dailyRevenue: { [key: string]: number } = {};
    bookings.forEach((b) => {
      const key = new Date(b.date).toISOString().slice(0, 10);
      dailyRevenue[key] = (dailyRevenue[key] || 0) + b.price;
    });

    const clientCounts: { [key: string]: number } = {};
    bookings.forEach((b) => {
      clientCounts[b.clientName] = (clientCounts[b.clientName] || 0) + 1;
    });
    const topClients = Object.entries(clientCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const slotCounts: { [key: string]: number } = {};
    bookings.forEach((b) => {
      const slot = `${b.startTime}-${b.endTime}`;
      slotCounts[slot] = (slotCounts[slot] || 0) + 1;
    });
    const popularSlots = Object.entries(slotCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([slot, count]) => ({ slot, count }));

    return {
      totalRevenue,
      totalBookings: bookings.length,
      uniqueClients,
      dailyRevenue: Object.entries(dailyRevenue).map(([date, revenue]) => ({
        date,
        revenue,
      })),
      topClients,
      popularSlots,
      bookings,
    };
  }

  static async getSlotsForDate(date: string) {
    const prisma = getPrisma();
    const settings = await prisma.stadiumSetting.findFirst();
    if (!settings) return [];

    const bookings = await this.getByDate(date);
    const openHour = parseInt(settings.openTime.split(':')[0]);
    const closeHour = parseInt(settings.closeTime.split(':')[0]);
    const slotUnit = settings.slotUnit;
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const isToday = date === todayStr;
    const currentMinutesTotal = now.getHours() * 60 + now.getMinutes();

    const slots: { start: string; end: string; status: string; bookedBy?: string; price?: number; bookingId?: string }[] = [];

    for (let h = openHour; h < closeHour; h += slotUnit / 60) {
      const start = `${String(h).padStart(2, '0')}:00`;
      const endHour = h + slotUnit / 60;
      const end = `${String(endHour).padStart(2, '0')}:00`;
      const slotStartMinutes = h * 60;

      const existing = bookings.find((b) => b.startTime === start && b.status !== 'cancelled');

      let status: string;
      if (existing) {
        status = 'booked';
      } else if (isToday && slotStartMinutes + slotUnit <= currentMinutesTotal) {
        status = 'expired';
      } else {
        status = 'available';
      }

      slots.push({
        start,
        end,
        status,
        bookedBy: existing?.clientName,
        price: existing?.price,
        bookingId: existing?.id,
      });
    }

    return slots;
  }

  static async getAvailableSlots(date: string) {
    const slots = await this.getSlotsForDate(date);
    return slots.filter((s) => s.status === 'available');
  }
}
