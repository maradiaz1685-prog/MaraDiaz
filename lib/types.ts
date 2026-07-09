export type Settings = {
  ownerName: string;
  bio: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  address: string;
};

export type DaySchedule = {
  day: string;
  open: string;
  close: string;
  closed: boolean;
};

export type Employee = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  category: string;
  phone: string;
  address: string;
  licenseNumber: string;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMin: number;
  imageUrl: string;
  active: boolean;
  employeeId: string | null;
  scheduleStart: string | null;
  scheduleEnd: string | null;
  slotDurationMin: number | null;
};

export type Booking = {
  id: string;
  serviceId: string;
  bookingDate: string;
  timeSlot: string;
  clientName: string;
  clientPhone: string;
  createdAt: string;
};

export type CourseType = "curso" | "taller" | "capacitacion";

export type Course = {
  id: string;
  name: string;
  type: CourseType;
  modality: string;
  duration: string;
  price: number;
  startDate: string;
  imageUrl: string;
  active: boolean;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  active: boolean;
};

export type RegistrationStatus = "pendiente" | "cliente" | "profesional";

export type Registration = {
  id: string;
  name: string;
  phone: string;
  status: RegistrationStatus;
  discountPercent: number | null;
  appliesServicios: boolean;
  appliesCursos: boolean;
  appliesProductos: boolean;
  accessCode: string;
  createdAt: string;
};

export function discountedPrice(price: number, percent: number): number {
  return Math.round(price * (1 - percent / 100));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

export function whatsappLink(phone: string, message: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
