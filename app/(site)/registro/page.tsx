"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PROVINCIAS_ARGENTINA } from "@/lib/provincias";

type Mode = "nuevo" | "existente";

function YaSoyClienteForm() {
  const router = useRouter();
  const [telefono, setTelefono] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<null | { found: boolean; status?: string; discountPercent?: number | null }>(
    null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    const res = await fetch("/api/registrations/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: telefono }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (data.found && data.status !== "pendiente" && data.discountPercent) {
      router.push(`/mi-descuento/${data.accessCode}`);
      return;
    }

    setResult(data);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-brand-100 bg-white p-8 flex flex-col gap-4 shadow-sm">
      <p className="text-sm text-ink-soft">
        Ingresá el teléfono con el que te registraste antes y buscamos tu descuento.
      </p>
      <div>
        <label className="block text-xs font-medium text-ink-soft mb-1.5">Teléfono</label>
        <input
          required
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Ej: 2954123456"
          className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
      </div>

      {result && !result.found && (
        <p className="text-sm text-red-500">
          No encontramos ese número. Si es tu primera vez, registrate como nueva/o cliente.
        </p>
      )}
      {result && result.found && result.status === "pendiente" && (
        <p className="text-sm text-brand-600">
          Ya te registraste y estamos revisando tu descuento. Te vamos a avisar por WhatsApp apenas esté listo.
        </p>
      )}
      {result && result.found && result.status !== "pendiente" && !result.discountPercent && (
        <p className="text-sm text-ink-soft">Encontramos tu registro, pero todavía no tenés un descuento asignado.</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-brand-600 text-white text-sm font-semibold py-2.5 mt-2 hover:bg-brand-700 transition-colors disabled:opacity-60"
      >
        {submitting ? "Buscando…" : "Buscar mi descuento"}
      </button>
    </form>
  );
}

export default function RegistroPage() {
  const [mode, setMode] = useState<Mode>("nuevo");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [provincia, setProvincia] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [ciudades, setCiudades] = useState<string[]>([]);
  const [loadingCiudades, setLoadingCiudades] = useState(false);
  const [direccion, setDireccion] = useState("");
  const [esCliente, setEsCliente] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!provincia) {
      setCiudades([]);
      return;
    }
    setCiudad("");
    setLoadingCiudades(true);
    fetch(
      `https://apis.datos.gob.ar/georef/api/localidades?provincia=${encodeURIComponent(provincia)}&campos=nombre&max=3000&orden=nombre`
    )
      .then((res) => res.json())
      .then((data) => {
        const nombres = (data.localidades ?? []).map((l: { nombre: string }) => l.nombre);
        setCiudades(nombres);
      })
      .catch(() => setCiudades([]))
      .finally(() => setLoadingCiudades(false));
  }, [provincia]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (esCliente === null) {
      setError("Contanos si ya sos clienta o cliente.");
      return;
    }
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${nombre} ${apellido}`.trim(),
        phone: telefono,
        province: provincia,
        city: ciudad,
        address: direccion,
        alreadyClient: esCliente,
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      setError("No se pudo completar el registro. Probá de nuevo.");
      return;
    }

    setSuccess(true);
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-20">
      <header className="text-center mb-8">
        <p className="uppercase tracking-[0.2em] text-xs font-semibold text-brand-600 mb-3">Mara Diaz</p>
        <h1 className="font-display text-3xl font-bold text-ink mb-4">Registrate</h1>
        <p className="text-ink-soft text-sm">
          Dejanos tus datos. Vas a formar parte de nuestra comunidad y podés llegar a recibir descuentos
          exclusivos en servicios, cursos o productos.
        </p>
      </header>

      {!success && (
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode("nuevo")}
            className={`flex-1 rounded-full px-3 py-2 text-sm font-medium border transition-colors ${
              mode === "nuevo"
                ? "bg-brand-600 text-white border-brand-600"
                : "border-brand-200 text-ink-soft hover:bg-brand-50"
            }`}
          >
            Soy nueva/o
          </button>
          <button
            type="button"
            onClick={() => setMode("existente")}
            className={`flex-1 rounded-full px-3 py-2 text-sm font-medium border transition-colors ${
              mode === "existente"
                ? "bg-brand-600 text-white border-brand-600"
                : "border-brand-200 text-ink-soft hover:bg-brand-50"
            }`}
          >
            Ya soy cliente
          </button>
        </div>
      )}

      {mode === "existente" && !success ? (
        <YaSoyClienteForm />
      ) : success ? (
        <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-8 text-center">
          <p className="text-brand-700 font-semibold mb-2">¡Listo, {nombre}!</p>
          <p className="text-sm text-ink-soft mb-6">
            Te registramos correctamente. Si te asignamos un descuento, te vamos a avisar por WhatsApp.
          </p>
          <Link
            href="/"
            className="inline-block rounded-full bg-brand-600 text-white text-sm font-medium px-6 py-2.5 hover:bg-brand-700 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-brand-100 bg-white p-8 flex flex-col gap-4 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink-soft mb-1.5">Nombre</label>
              <input
                required
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-soft mb-1.5">Apellido</label>
              <input
                required
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-soft mb-1.5">Teléfono</label>
            <input
              required
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: 2954123456"
              className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink-soft mb-1.5">Provincia</label>
              <select
                required
                value={provincia}
                onChange={(e) => setProvincia(e.target.value)}
                className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                <option value="">Seleccioná…</option>
                {PROVINCIAS_ARGENTINA.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-soft mb-1.5">
                Ciudad / Localidad {loadingCiudades && "(buscando…)"}
              </label>
              <input
                required
                type="text"
                list="ciudades-list"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                disabled={!provincia}
                placeholder={provincia ? "Elegí o escribí" : "Elegí una provincia"}
                className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 disabled:bg-brand-50/50"
              />
              <datalist id="ciudades-list">
                {ciudades.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-soft mb-1.5">
              Dirección <span className="text-ink-soft/70">(opcional, por si necesitás envío a domicilio)</span>
            </label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-soft mb-1.5">¿Ya sos clienta/cliente nuestro/a?</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEsCliente(true)}
                className={`flex-1 rounded-full px-3 py-2 text-sm font-medium border transition-colors ${
                  esCliente === true
                    ? "bg-brand-600 text-white border-brand-600"
                    : "border-brand-200 text-ink-soft hover:bg-brand-50"
                }`}
              >
                Sí
              </button>
              <button
                type="button"
                onClick={() => setEsCliente(false)}
                className={`flex-1 rounded-full px-3 py-2 text-sm font-medium border transition-colors ${
                  esCliente === false
                    ? "bg-brand-600 text-white border-brand-600"
                    : "border-brand-200 text-ink-soft hover:bg-brand-50"
                }`}
              >
                No
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-brand-600 text-white text-sm font-semibold py-2.5 mt-2 hover:bg-brand-700 transition-colors disabled:opacity-60"
          >
            {submitting ? "Registrando…" : "Registrarme"}
          </button>
        </form>
      )}
    </div>
  );
}
