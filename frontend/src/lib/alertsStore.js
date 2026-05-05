import { create } from "zustand";

const MAX_ALERTS = 20;

export const useAlertsStore = create((set) => ({
  alerts: [],
  unreadCount: 0,

  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts].slice(0, MAX_ALERTS),
      unreadCount: state.unreadCount + 1,
    })),

  markAllRead: () =>
    set(() => ({ unreadCount: 0 })),

  clearAlerts: () =>
    set(() => ({ alerts: [], unreadCount: 0 })),
}));