import type { Metadata } from "next";
import AnimatedSection from "@/components/animations/AnimatedSection";
import ContactForm from "@/components/contacto/ContactForm";
import { getSiteSettingsContent } from "@/sanity/lib/content";

export const metadata: Metadata = {
  title: "Contacto | Vital Emocion",
  description:
    "Contactanos para agendar una cita o resolver tus dudas.",
  openGraph: {
    title: "Contacto | Vital Emocion",
    description: "Contactanos para agendar una cita o resolver tus dudas.",
  },
};

export default async function ContactoPage() {
  const siteSettings = await getSiteSettingsContent();
  const contactPhone = siteSettings?.contactPhone || "+57 (601) 555-0123";
  const secondaryPhone = siteSettings?.secondaryPhone || "+57 300 555 0123";
  const contactEmail = siteSettings?.contactEmail || "contacto@vitalemocion.com";
  const addressLine1 = siteSettings?.addressLine1 || "Calle 93 #14-20, Oficina 502";
  const addressLine2 = siteSettings?.addressLine2 || "Bogota, Colombia";
  const businessHours =
    siteSettings?.businessHours?.length
      ? siteSettings.businessHours
      : ["Lunes a Viernes: 8:00 AM - 6:00 PM", "Sabados: 9:00 AM - 1:00 PM"];
  const socialLinks = [
    { href: siteSettings?.socialInstagram || "", label: "Instagram" },
    { href: siteSettings?.socialFacebook || "", label: "Facebook" },
    { href: siteSettings?.socialLinkedin || "", label: "LinkedIn" },
  ].filter((item) => item.href);

  return (
    <>
      {/* Hero */}
      <section className="bg-primary-dark h-[40vh] flex items-center justify-center relative">
        <div className="absolute inset-0 bg-black/20" />
        <AnimatedSection animation="fade-up" className="relative z-10 text-center px-6">
          <h1 className="font-serif text-5xl text-white">Contactanos</h1>
          <p className="text-white/80 mt-4 text-lg">
            Estamos aqui para ayudarte
          </p>
        </AnimatedSection>
      </section>

      {/* Content */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form */}
          <AnimatedSection animation="fade-left">
            <h2 className="font-serif text-2xl text-text-primary mb-6">
              Envianos un mensaje
            </h2>
            <ContactForm />
          </AnimatedSection>

          {/* Contact info */}
          <AnimatedSection animation="fade-right">
            <h2 className="font-serif text-2xl text-text-primary mb-6">
              Informacion de contacto
            </h2>
            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                    aria-hidden="true"
                  >
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Telefono</h3>
                  <p className="text-text-secondary text-sm mt-1">
                    {contactPhone}
                  </p>
                  <p className="text-text-secondary text-sm">
                    {secondaryPhone}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                    aria-hidden="true"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Email</h3>
                  <p className="text-text-secondary text-sm mt-1">
                    {contactEmail}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                    aria-hidden="true"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Direccion</h3>
                  <p className="text-text-secondary text-sm mt-1">
                    {addressLine1}
                  </p>
                  <p className="text-text-secondary text-sm">
                    {addressLine2}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Horario</h3>
                  <p className="text-text-secondary text-sm mt-1">
                    {businessHours[0] || ""}
                  </p>
                  <p className="text-text-secondary text-sm">
                    {businessHours[1] || ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Social media */}
            {socialLinks.length > 0 && (
              <div className="mt-10">
                <h3 className="font-semibold text-text-primary mb-4">
                  Siguenos en redes
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((socialLink) => (
                    <a
                      key={socialLink.label}
                      href={socialLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                      aria-label={socialLink.label}
                    >
                      {socialLink.label === "Instagram" && (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-primary"
                          aria-hidden="true"
                        >
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      )}
                      {socialLink.label === "Facebook" && (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-primary"
                          aria-hidden="true"
                        >
                          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                        </svg>
                      )}
                      {socialLink.label === "LinkedIn" && (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-primary"
                          aria-hidden="true"
                        >
                          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                          <rect x="2" y="9" width="4" height="12" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
