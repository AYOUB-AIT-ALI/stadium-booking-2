interface ElectronAPI {
  createBooking: (data: any) => Promise<{ success: boolean; data?: any; error?: string }>;
  getBookings: (filters?: any) => Promise<{ success: boolean; data?: any; error?: string }>;
  getBookingsByDate: (date: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  getBookingById: (id: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  cancelBooking: (id: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  deleteBooking: (id: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  getMonthlyReport: (year: number, month: number) => Promise<{ success: boolean; data?: any; error?: string }>;
  getAvailableSlots: (date: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  getSlotsForDate: (date: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  getSettings: () => Promise<{ success: boolean; data?: any; error?: string }>;
  updateSettings: (data: any) => Promise<{ success: boolean; data?: any; error?: string }>;
  generateReceipt: (bookingId: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  downloadReceipt: (bookingId: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  openPath: (filePath: string) => Promise<{ success: boolean; error?: string }>;
  confirm: (message: string) => Promise<boolean>;
}

interface Window {
  electronAPI: ElectronAPI;
}
