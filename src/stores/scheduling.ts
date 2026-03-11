import { create } from "zustand";

export interface SchedulingService {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

export interface SchedulingPsychologist {
  id: string;
  name: string;
  specialties: string[];
  photoUrl: string | null;
  bio: string;
}

export interface PatientInfo {
  name: string;
  email: string;
  phone: string;
}

export interface BookingResult {
  success: boolean;
  bookingId?: number;
  appointmentId?: string | null;
  psychologistId?: string;
  psychologistName?: string;
}

interface SchedulingStore {
  currentStep: 1 | 2 | 3;
  selectedService: SchedulingService | null;
  selectedPsychologist: SchedulingPsychologist | null;
  selectedSlot: string | null; // ISO datetime
  selectedDate: string | null; // YYYY-MM-DD
  patientInfo: PatientInfo;
  bookingResult: BookingResult | null;
  isBooking: boolean;

  setService: (service: SchedulingService) => void;
  setPsychologist: (psychologist: SchedulingPsychologist | null) => void;
  setSlot: (slot: string) => void;
  setDate: (date: string) => void;
  setPatientInfo: (info: PatientInfo) => void;
  setBookingResult: (result: BookingResult) => void;
  setIsBooking: (loading: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const initialPatientInfo: PatientInfo = {
  name: "",
  email: "",
  phone: "",
};

export const useSchedulingStore = create<SchedulingStore>()((set) => ({
  currentStep: 1,
  selectedService: null,
  selectedPsychologist: null,
  selectedSlot: null,
  selectedDate: null,
  patientInfo: initialPatientInfo,
  bookingResult: null,
  isBooking: false,

  setService: (service) => set({ selectedService: service }),

  setPsychologist: (psychologist) =>
    set({ selectedPsychologist: psychologist }),

  setSlot: (slot) => set({ selectedSlot: slot }),

  setDate: (date) => set({ selectedDate: date }),

  setPatientInfo: (info) => set({ patientInfo: info }),

  setBookingResult: (result) => set({ bookingResult: result }),

  setIsBooking: (loading) => set({ isBooking: loading }),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 3) as 1 | 2 | 3,
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1) as 1 | 2 | 3,
    })),

  reset: () =>
    set({
      currentStep: 1,
      selectedService: null,
      selectedPsychologist: null,
      selectedSlot: null,
      selectedDate: null,
      patientInfo: initialPatientInfo,
      bookingResult: null,
      isBooking: false,
    }),
}));
