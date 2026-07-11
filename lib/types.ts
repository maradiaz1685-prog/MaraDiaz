export type Settings = {
  ownerName: string;
  bio: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  address: string;
  defaultProfessionalDiscountPercent: number;
  defaultClientDiscountPercent: number;
  defaultOfferPercent: number;
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

export type Distributor = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  logoUrl: string;
  createdAt: string;
};

export type ProductType = "normal" | "estacion" | "oferta";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  active: boolean;
  distributorId: string | null;
  cost: number;
  profitPercent: number;
  professionalDiscountPercent: number | null;
  clientDiscountPercent: number | null;
  productType: ProductType;
  offerDiscountPercent: number | null;
  minStockAlert: number | null;
};

export function priceFromCost(cost: number, profitPercent: number): number {
  return Math.round(cost * (1 + profitPercent / 100));
}

export function profitPercentFromPrice(cost: number, price: number): number {
  if (!cost) return 0;
  return Math.round(((price - cost) / cost) * 1000) / 10;
}

// Precio que ve un visitante identificado por teléfono (cliente o profesional):
// gana el % individual asignado a mano en /admin/registros si existe; si no,
// se usa el % default que la admin cargó en el producto según su status.
export function viewerDiscountPercent(
  status: "cliente" | "profesional" | null,
  registrationDiscountPercent: number | null | undefined,
  appliesProductos: boolean | undefined,
  product: Pick<Product, "professionalDiscountPercent" | "clientDiscountPercent">
): number {
  if (!status) return 0;
  if (appliesProductos && registrationDiscountPercent) return registrationDiscountPercent;
  if (status === "profesional") return product.professionalDiscountPercent ?? 0;
  return product.clientDiscountPercent ?? 0;
}

export type RegistrationStatus = "pendiente" | "cliente" | "profesional";

export type Registration = {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  alreadyClient: boolean;
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
