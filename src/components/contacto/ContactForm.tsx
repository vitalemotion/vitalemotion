"use client";

import { useState, type FormEvent } from "react";

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
}

interface FormErrors {
  nombre?: string;
  email?: string;
  mensaje?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): FormErrors {
    const errs: FormErrors = {};

    if (!formData.nombre.trim() || formData.nombre.trim().length < 2) {
      errs.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      errs.email = "Ingresa un email valido";
    }

    if (!formData.mensaje.trim() || formData.mensaje.trim().length < 10) {
      errs.mensaje = "El mensaje debe tener al menos 10 caracteres";
    }

    return errs;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="bg-surface rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-success"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="font-serif text-xl text-text-primary mt-4">
          Mensaje enviado exitosamente
        </h3>
        <p className="text-text-secondary mt-2">
          Te contactaremos pronto.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Nombre */}
      <div>
        <label
          htmlFor="nombre"
          className="block text-sm font-medium text-text-primary mb-1.5"
        >
          Nombre
        </label>
        <input
          id="nombre"
          type="text"
          value={formData.nombre}
          onChange={(e) =>
            setFormData({ ...formData, nombre: e.target.value })
          }
          className={`w-full bg-surface border rounded-xl p-4 transition focus:outline-none ${
            errors.nombre
              ? "border-error focus:border-error"
              : "border-transparent focus:border-primary"
          }`}
          placeholder="Tu nombre completo"
        />
        {errors.nombre && (
          <p className="text-error text-sm mt-1">{errors.nombre}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-text-primary mb-1.5"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          className={`w-full bg-surface border rounded-xl p-4 transition focus:outline-none ${
            errors.email
              ? "border-error focus:border-error"
              : "border-transparent focus:border-primary"
          }`}
          placeholder="tu@email.com"
        />
        {errors.email && (
          <p className="text-error text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Telefono */}
      <div>
        <label
          htmlFor="telefono"
          className="block text-sm font-medium text-text-primary mb-1.5"
        >
          Telefono{" "}
          <span className="text-text-muted font-normal">(opcional)</span>
        </label>
        <input
          id="telefono"
          type="tel"
          value={formData.telefono}
          onChange={(e) =>
            setFormData({ ...formData, telefono: e.target.value })
          }
          className="w-full bg-surface border border-transparent focus:border-primary rounded-xl p-4 transition focus:outline-none"
          placeholder="+57 300 000 0000"
        />
      </div>

      {/* Mensaje */}
      <div>
        <label
          htmlFor="mensaje"
          className="block text-sm font-medium text-text-primary mb-1.5"
        >
          Mensaje
        </label>
        <textarea
          id="mensaje"
          rows={5}
          value={formData.mensaje}
          onChange={(e) =>
            setFormData({ ...formData, mensaje: e.target.value })
          }
          className={`w-full bg-surface border rounded-xl p-4 transition focus:outline-none resize-none ${
            errors.mensaje
              ? "border-error focus:border-error"
              : "border-transparent focus:border-primary"
          }`}
          placeholder="Cuentanos en que podemos ayudarte..."
        />
        {errors.mensaje && (
          <p className="text-error text-sm mt-1">{errors.mensaje}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-white rounded-xl px-8 py-3 font-semibold hover:bg-primary-dark transition-colors"
      >
        Enviar mensaje
      </button>
    </form>
  );
}
