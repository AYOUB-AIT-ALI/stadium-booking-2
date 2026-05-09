import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  createBooking: (data: any) => ipcRenderer.invoke('booking:create', data),
  getBookings: (filters?: any) => ipcRenderer.invoke('booking:getAll', filters),
  getBookingsByDate: (date: string) => ipcRenderer.invoke('booking:getByDate', date),
  getBookingById: (id: string) => ipcRenderer.invoke('booking:getById', id),
  cancelBooking: (id: string) => ipcRenderer.invoke('booking:cancel', id),
  deleteBooking: (id: string) => ipcRenderer.invoke('booking:delete', id),
  getMonthlyReport: (year: number, month: number) => ipcRenderer.invoke('booking:monthlyReport', year, month),
  getAvailableSlots: (date: string) => ipcRenderer.invoke('booking:availableSlots', date),
  getSlotsForDate: (date: string) => ipcRenderer.invoke('booking:slotsForDate', date),
  getSettings: () => ipcRenderer.invoke('settings:get'),
  updateSettings: (data: any) => ipcRenderer.invoke('settings:update', data),
  generateReceipt: (bookingId: string) => ipcRenderer.invoke('receipt:generate', bookingId),
  downloadReceipt: (bookingId: string) => ipcRenderer.invoke('receipt:download', bookingId),
  openPath: (filePath: string) => ipcRenderer.invoke('file:openPath', filePath),
  confirm: (message: string) => ipcRenderer.invoke('dialog:confirm', message),
});
