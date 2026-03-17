import type { Metadata } from "next";
import AnimatedSection from "@/components/animations/AnimatedSection";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politica de Privacidad | Vital Emocion",
  description:
    "Conoce como recopilamos, usamos y protegemos tus datos personales en Vital Emocion.",
  openGraph: {
    title: "Politica de Privacidad | Vital Emocion",
    description:
      "Conoce como recopilamos, usamos y protegemos tus datos personales en Vital Emocion.",
  },
};

export default function PoliticaPrivacidadPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary-dark h-[40vh] flex items-center justify-center relative">
        <div className="absolute inset-0 bg-black/20" />
        <AnimatedSection animation="fade-up" className="relative z-10 text-center px-6">
          <h1 className="font-serif text-5xl text-white">Politica de Privacidad</h1>
          <p className="text-white/80 mt-4 text-lg">
            Tu privacidad es nuestra prioridad
          </p>
        </AnimatedSection>
      </section>

      {/* Content */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection animation="fade-up">
            <p className="text-text-secondary mb-8">
              Ultima actualizacion: 16 de marzo de 2026
            </p>

            <div className="prose prose-lg max-w-none space-y-10">
              {/* Introduccion */}
              <div>
                <p className="text-text-secondary leading-relaxed">
                  En Vital Emocion nos comprometemos a proteger la privacidad y
                  seguridad de tus datos personales. Esta politica describe como
                  recopilamos, usamos, almacenamos y protegemos tu informacion
                  cuando utilizas nuestros servicios de psicologia y nuestra
                  plataforma web.
                </p>
              </div>

              {/* Datos que recopilamos */}
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-4">
                  1. Datos que recopilamos
                </h2>
                <p className="text-text-secondary leading-relaxed mb-3">
                  Recopilamos los siguientes tipos de datos personales cuando te
                  registras y utilizas nuestros servicios:
                </p>
                <ul className="space-y-2 text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>
                      <strong className="text-text-primary">Datos de identificacion:</strong>{" "}
                      nombre completo y direccion de correo electronico.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>
                      <strong className="text-text-primary">Datos de contacto:</strong>{" "}
                      numero de telefono y direccion de envio.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>
                      <strong className="text-text-primary">Historial de citas:</strong>{" "}
                      fecha, hora, servicio y psicologo asignado de cada cita
                      agendada.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>
                      <strong className="text-text-primary">Historial de compras:</strong>{" "}
                      productos adquiridos, montos pagados y direccion de envio.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>
                      <strong className="text-text-primary">Datos de sesion:</strong>{" "}
                      informacion tecnica necesaria para mantener tu sesion activa
                      y segura.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Finalidad del tratamiento */}
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-4">
                  2. Finalidad del tratamiento
                </h2>
                <p className="text-text-secondary leading-relaxed mb-3">
                  Utilizamos tus datos personales para los siguientes fines:
                </p>
                <ul className="space-y-2 text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>Gestionar tu cuenta y autenticacion en la plataforma.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>Agendar, confirmar y gestionar tus citas de psicologia.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>Procesar tus compras y enviar los productos adquiridos.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>Enviarte recordatorios de citas por correo electronico o WhatsApp, segun tus preferencias.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>Mejorar la calidad de nuestros servicios y la experiencia del usuario.</span>
                  </li>
                </ul>
              </div>

              {/* Retencion de datos */}
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-4">
                  3. Retencion de datos
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  Conservamos tus datos personales mientras mantengas una cuenta
                  activa en nuestra plataforma. Si decides eliminar tu cuenta,
                  procederemos a borrar todos tus datos personales, historial de
                  citas e historial de compras de forma permanente, salvo aquellos
                  que estemos obligados a conservar por disposiciones legales o
                  contables aplicables en Colombia.
                </p>
              </div>

              {/* Derechos del paciente */}
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-4">
                  4. Tus derechos
                </h2>
                <p className="text-text-secondary leading-relaxed mb-3">
                  De conformidad con la legislacion colombiana de proteccion de
                  datos (Ley 1581 de 2012), tienes derecho a:
                </p>
                <ul className="space-y-2 text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>
                      <strong className="text-text-primary">Acceso:</strong>{" "}
                      solicitar informacion sobre los datos personales que tenemos
                      sobre ti.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>
                      <strong className="text-text-primary">Rectificacion:</strong>{" "}
                      corregir datos inexactos o incompletos desde tu perfil o
                      contactandonos directamente.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>
                      <strong className="text-text-primary">Supresion:</strong>{" "}
                      solicitar la eliminacion de tu cuenta y todos los datos
                      asociados desde la seccion &quot;Eliminar mi cuenta&quot; en tu
                      perfil.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>
                      <strong className="text-text-primary">Portabilidad:</strong>{" "}
                      solicitar una copia de tus datos en un formato estructurado.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Contacto para solicitudes de datos */}
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-4">
                  5. Contacto para solicitudes de datos
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  Para ejercer cualquiera de tus derechos o si tienes preguntas
                  sobre el tratamiento de tus datos personales, puedes
                  contactarnos a traves de:
                </p>
                <ul className="space-y-2 text-text-secondary mt-3">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>
                      Correo electronico:{" "}
                      <strong className="text-text-primary">contacto@vitalemocion.com</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>
                      A traves de nuestra{" "}
                      <Link href="/contacto" className="text-primary hover:text-primary-dark underline transition-colors">
                        pagina de contacto
                      </Link>
                    </span>
                  </li>
                </ul>
                <p className="text-text-secondary leading-relaxed mt-3">
                  Responderemos a tu solicitud dentro de los quince (15) dias
                  habiles siguientes a la recepcion.
                </p>
              </div>

              {/* Cookies */}
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-4">
                  6. Uso de cookies
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  Nuestra plataforma utiliza cookies esenciales para el
                  funcionamiento del sitio, como la gestion de sesiones de
                  usuario y preferencias de consentimiento. No utilizamos cookies
                  de seguimiento ni de publicidad de terceros. Al utilizar
                  nuestro sitio, puedes aceptar o rechazar el uso de cookies
                  mediante el banner que se muestra al ingresar por primera vez.
                </p>
              </div>

              {/* Seguridad */}
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-4">
                  7. Seguridad de los datos
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  Implementamos medidas de seguridad tecnicas y organizativas
                  para proteger tus datos personales contra acceso no
                  autorizado, perdida o alteracion. Esto incluye cifrado de
                  contrasenas, conexiones seguras (HTTPS) y controles de acceso
                  basados en roles.
                </p>
              </div>

              {/* Cambios */}
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-4">
                  8. Cambios en esta politica
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  Nos reservamos el derecho de actualizar esta politica de
                  privacidad en cualquier momento. Los cambios se publicaran en
                  esta misma pagina con la fecha de la ultima actualizacion. Te
                  recomendamos revisarla periodicamente.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
