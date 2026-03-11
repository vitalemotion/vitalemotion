"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TeamForm from "@/components/admin/TeamForm";

interface TeamData {
  id: string;
  name: string;
  email: string;
  bio: string;
  specialties: string[];
  calcomUserId: string;
  isActive: boolean;
}

export default function EditPsicologoPage() {
  const params = useParams();
  const id = params.id as string;
  const [member, setMember] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMember() {
      try {
        const res = await fetch(`/api/admin/team/${id}`);
        const data = await res.json();
        setMember(data);
      } catch {
        console.error("Error loading team member");
      } finally {
        setLoading(false);
      }
    }
    fetchMember();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-surface rounded-xl p-12 text-center">
        <p className="text-text-muted">Cargando perfil...</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="bg-surface rounded-xl p-12 text-center">
        <p className="text-text-muted">Psicologo no encontrado.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-text-primary mb-6">Editar Psicologo</h1>
      <TeamForm mode="edit" initialData={member} />
    </div>
  );
}
