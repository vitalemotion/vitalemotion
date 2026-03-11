"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  specialties: string[];
  photoUrl: string | null;
  isActive: boolean;
}

export default function AdminEquipoPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await fetch("/api/admin/team");
        const data = await res.json();
        setTeam(data);
      } catch {
        console.error("Error loading team");
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-text-primary">Equipo</h1>
        <Link
          href="/admin/equipo/nuevo"
          className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          Agregar Psicologo
        </Link>
      </div>

      {loading ? (
        <div className="bg-surface rounded-xl p-12 text-center">
          <p className="text-text-muted">Cargando equipo...</p>
        </div>
      ) : team.length === 0 ? (
        <div className="bg-surface rounded-xl p-12 text-center">
          <p className="text-text-muted">No hay miembros del equipo registrados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-surface rounded-xl p-6 shadow-sm"
            >
              {/* Photo placeholder */}
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-serif text-primary">
                  {member.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </div>

              <div className="text-center mb-4">
                <h3 className="font-medium text-text-primary text-lg">{member.name}</h3>
                <p className="text-sm text-text-muted">{member.email}</p>
                <span
                  className={`inline-block mt-2 rounded-full px-3 py-1 text-xs font-medium ${
                    member.isActive
                      ? "bg-success/10 text-success"
                      : "bg-error/10 text-error"
                  }`}
                >
                  {member.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>

              {/* Specialties */}
              {member.specialties.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                  {member.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              )}

              {/* Bio excerpt */}
              {member.bio && (
                <p className="text-sm text-text-secondary text-center line-clamp-2 mb-4">
                  {member.bio}
                </p>
              )}

              {/* Edit link */}
              <div className="text-center">
                <Link
                  href={`/admin/equipo/${member.id}`}
                  className="text-primary hover:text-primary-dark text-sm font-medium transition-colors"
                >
                  Editar Perfil
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
