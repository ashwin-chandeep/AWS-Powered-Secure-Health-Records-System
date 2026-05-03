import { create } from 'zustand';

const CITY_KEY = 'selected_city';
const CITIES   = ['Chennai', 'Madurai'];

export const useCityStore = create((set) => ({
  city: localStorage.getItem(CITY_KEY) || null,

  setCity: (city) => {
    localStorage.setItem(CITY_KEY, city);
    set({ city });
  },

  clearCity: () => {
    localStorage.removeItem(CITY_KEY);
    set({ city: null });
  },
}));

export const AVAILABLE_CITIES = CITIES;
