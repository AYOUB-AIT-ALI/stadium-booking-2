import { ipcMain, dialog, shell } from 'electron';
import { BookingService } from '../services/BookingService';
import { ReceiptService } from '../services/ReceiptService';
import { getPrisma, getDatabasePath } from '../database/database';
import path from 'path';
import fs from 'fs';

export function registerIpcHandlers(): void {
  ipcMain.handle('booking:create', async (_event, data) => {
    try {
      const booking = await BookingService.create(data);
      return { success: true, data: booking };
    } catch (error: any) {
      if (error.code === 'P2002') {
        return { success: false, error: 'This time slot is already booked for this date.' };
      }
      return { success: false, error: error.message || 'Failed to create booking.' };
    }
  });

  ipcMain.handle('booking:getAll', async (_event, filters) => {
    try {
      const bookings = await BookingService.getAll(filters);
      return { success: true, data: bookings };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('booking:getByDate', async (_event, date: string) => {
    try {
      const bookings = await BookingService.getByDate(date);
      return { success: true, data: bookings };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('booking:getById', async (_event, id: string) => {
    try {
      const booking = await BookingService.getById(id);
      return { success: true, data: booking };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('booking:cancel', async (_event, id: string) => {
    try {
      const booking = await BookingService.cancel(id);
      return { success: true, data: booking };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('booking:delete', async (_event, id: string) => {
    try {
      const booking = await BookingService.delete(id);
      return { success: true, data: booking };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('booking:monthlyReport', async (_event, year: number, month: number) => {
    try {
      const report = await BookingService.getMonthlyReport(year, month);
      return { success: true, data: report };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('booking:availableSlots', async (_event, date: string) => {
    try {
      const slots = await BookingService.getAvailableSlots(date);
      return { success: true, data: slots };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('booking:slotsForDate', async (_event, date: string) => {
    try {
      const slots = await BookingService.getSlotsForDate(date);
      return { success: true, data: slots };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('settings:get', async () => {
    try {
      const prisma = getPrisma();
      let settings = await prisma.stadiumSetting.findFirst();
      if (!settings) {
        settings = await prisma.stadiumSetting.create({
          data: {
            name: 'City Football Stadium',
            openTime: '08:00',
            closeTime: '23:00',
            slotUnit: 60,
            phone: '+1-555-0100',
            address: '123 Stadium Avenue, Sports City',
          },
        });
      }
      return { success: true, data: settings };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('settings:update', async (_event, data) => {
    try {
      const prisma = getPrisma();
      const settings = await prisma.stadiumSetting.findFirst();
      if (settings) {
        const updated = await prisma.stadiumSetting.update({
          where: { id: settings.id },
          data,
        });
        return { success: true, data: updated };
      }
      return { success: false, error: 'Settings not found.' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('receipt:generate', async (_event, bookingId: string) => {
    try {
      const prisma = getPrisma();
      const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
      if (!booking) {
        return { success: false, error: 'Booking not found.' };
      }

      const settings = await prisma.stadiumSetting.findFirst();

      const filePath = ReceiptService.generateReceipt({
        bookingNumber: booking.bookingNumber,
        clientName: booking.clientName,
        clientPhone: booking.clientPhone,
        date: booking.date.toISOString(),
        startTime: booking.startTime,
        endTime: booking.endTime,
        price: booking.price,
        paid: booking.paid,
        notes: booking.notes || '',
        stadiumName: settings?.name || 'City Football Stadium',
        stadiumPhone: settings?.phone || '',
        stadiumAddress: settings?.address || '',
      });

      await BookingService.updateReceiptPath(booking.id, filePath);
      return { success: true, data: { filePath } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('receipt:download', async (_event, bookingId: string) => {
    try {
      const prisma = getPrisma();
      const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
      if (!booking) {
        return { success: false, error: 'Booking not found.' };
      }

      const settings = await prisma.stadiumSetting.findFirst();
      const buffer = ReceiptService.generateReceiptBuffer({
        bookingNumber: booking.bookingNumber,
        clientName: booking.clientName,
        clientPhone: booking.clientPhone,
        date: booking.date.toISOString(),
        startTime: booking.startTime,
        endTime: booking.endTime,
        price: booking.price,
        paid: booking.paid,
        notes: booking.notes || '',
        stadiumName: settings?.name || 'City Football Stadium',
        stadiumPhone: settings?.phone || '',
        stadiumAddress: settings?.address || '',
      });

      const result = await dialog.showSaveDialog({
        defaultPath: `receipt_${booking.bookingNumber}.pdf`,
        filters: [{ name: 'PDF', extensions: ['pdf'] }],
      });

      if (!result.canceled && result.filePath) {
        fs.writeFileSync(result.filePath, buffer);
        return { success: true, data: { filePath: result.filePath } };
      }
      return { success: false, error: 'Save cancelled.' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('file:openPath', async (_event, filePath: string) => {
    try {
      await shell.openPath(path.dirname(filePath));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('dialog:confirm', async (_event, message: string) => {
    const result = await dialog.showMessageBox({
      type: 'question',
      buttons: ['Yes', 'No'],
      defaultId: 0,
      cancelId: 1,
      message,
    });
    return result.response === 0;
  });
}
