import type { Metadata } from "next";
import AnimatedSection from "@/components/animations/AnimatedSection";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terminos y Condiciones | Vital Emocion",
  description:
    "Terminos y condiciones de uso de los servicios de Vital Emocion.",
  openGraph: {
    title: "Terminos y Condiciones | Vital Emocion",
    description:
      "Terminos y condiciones de uso de los servicios de Vital Emocion.",
  },
};

export default function TerminosPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary-dark h-[40vh] flex items-center justify-center relative">
        <div className="absolute inset-0 bg-black/20" />
        <AnimatedSection animation="fade-up" className="relative z-10 text-center px-6">
          <h1 className="font-serif text-5xl text-white">Terminos y Condiciones</h1>
          <p className="text-white/80 mt-4 text-lg">
            Condiciones de uso de nuestros servicios
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
              {/* Descripcion del servicio */}
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-4">
                  1. Descripcion del servicio
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  Vital Emocion es un centro de atencion psicologica ubicado en
                  Bogota, Colombia. A traves de nuestra plataforma web
                  ofrecemos servicios de agendamiento de citas de psicologia
                  (terapia individual, terapia de pareja, talleres y evaluacion
                  psicologica), venta de productos digitales y fisicos
                  relacionados con el bienestar emocional, y contenido
                  informativo a traves de nuestro blog.
                </p>
              </div>

              {/* Aceptacion de terminos */}
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-4">
                  2. Aceptacion de los terminos
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  Al registrarte en nuestra plataforma, agendar una cita o
                  realizar una compra, aceptas estos terminos y condiciones en
                  su totalidad. Si no estas de acuerdo con alguna de estas
                  condiciones, te pedimos que no utilices nuestros servicios.
                </p>
              </div>

              {/* Limitacion de responsabilidad */}
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-4">
                  3. Limitacion de responsabilidad
                </h2>
                <p className="text-text-secondary leading-relaxed mb-3">
                  Vital Emocion proporciona servicios de atencion psicologica
                  con fines terapeuticos. Sin embargo:
                </p>
                <ul className="space-y-2 text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>
                      Nuestros servicios no sustituyen una consulta medica de
                      urgencia ni un tratamiento psiquiatrico cuando este sea
                      necesario.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>
                      El contenido publicado en nuestro blog tiene un caracter
                      informativo y educativo, y no constituye consejo medico
                      profesional individualizado.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>
                      No nos hacemos responsables por interrupciones temporales
                      del servicio web debido a mantenimiento o factores
                      externos.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>
                      Los resultados de la terapia varian segun cada persona y no
                      pueden ser garantizados.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Terminos de pago */}
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-4">
                  4. Terminos de pago
                </h2>
                <ul className="space-y-2 text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>
                      Los pagos de productos en la tienda se procesan a traves
                      de PayPal. Los precios se muestran en pesos colombianos
                      (COP) y pueden estar sujetos a conversion de moneda segun
                      tu metodo de pago.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>
                      El pago de las sesiones de psicologia se acuerda
                      directamente con el psicologo asignado, salvo que se
                      indique otro metodo en la plataforma.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>
                      Los productos digitales no admiten devolucion una vez
                      entregados. Los productos fisicos pueden ser devueltos
                      dentro de los primeros 5 dias habiles posteriores a la
                      entrega si se encuentran en su estado original.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Politica de cancelacion */}
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-4">
                  5. Politica de cancelacion de citas
                </h2>
                <p className="text-text-secondary leading-relaxed mb-3">
                  Entendemos que pueden surgir imprevistos. Nuestra politica de
                  cancelacion es la siguiente:
                </p>
                <ul className="space-y-2 text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>
                      Las citas pueden cancelarse o reprogramarse sin costo
                      hasta <strong className="text-text-primary">24 horas antes</strong> de
                      la hora programada.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>
                      Las cancelaciones realizadas con menos de 24 horas de
                      anticipacion pueden estar sujetas a un cargo parcial o
                      total del valor de la sesion.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span>
                      La inasistencia sin aviso previo (no show) se considera
                      como una sesion consumida.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Propiedad intelectual */}
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-4">
                  6. Propiedad intelectual
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  Todo el contenido de este sitio web, incluyendo textos,
                  imagenes, logotipos, articulos del blog, materiales de
                  talleres y productos digitales, es propiedad de Vital Emocion
                  o de sus respectivos autores y esta protegido por las leyes de
                  derechos de autor de Colombia (Ley 23 de 1982). Queda
                  prohibida su reproduccion, distribucion o modificacion sin
                  autorizacion previa por escrito.
                </p>
              </div>

              {/* Resolucion de disputas */}
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-4">
                  7. Resolucion de disputas
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  Cualquier controversia que surja de la prestacion de
                  nuestros servicios o del uso de esta plataforma sera resuelta
                  en primera instancia mediante dialogo directo entre las
                  partes. Si no se alcanza un acuerdo, las partes podran acudir
                  a los mecanismos de conciliacion previstos por la ley
                  colombiana. En ultima instancia, la disputa sera sometida a la
                  jurisdiccion de los tribunales competentes de Bogota,
                  Colombia.
                </p>
              </div>

              {/* Proteccion de datos */}
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-4">
                  8. Proteccion de datos personales
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  El tratamiento de tus datos personales se rige por nuestra{" "}
                  <Link
                    href="/politica-privacidad"
                    className="text-primary hover:text-primary-dark underline transition-colors"
                  >
                    Politica de Privacidad
                  </Link>
                  , la cual forma parte integral de estos terminos y
                  condiciones.
                </p>
              </div>

              {/* Modificaciones */}
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-4">
                  9. Modificaciones
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  Vital Emocion se reserva el derecho de modificar estos
                  terminos y condiciones en cualquier momento. Los cambios seran
                  publicados en esta pagina con la fecha de la ultima
                  actualizacion. El uso continuado de nuestros servicios
                  despues de una modificacion implica la aceptacion de los
                  nuevos terminos.
                </p>
              </div>

              {/* Contacto */}
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-4">
                  10. Contacto
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  Si tienes preguntas sobre estos terminos y condiciones, puedes
                  contactarnos en{" "}
                  <strong className="text-text-primary">contacto@vitalemocion.com</strong>{" "}
                  o a traves de nuestra{" "}
                  <Link
                    href="/contacto"
                    className="text-primary hover:text-primary-dark underline transition-colors"
                  >
                    pagina de contacto
                  </Link>
                  .
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
