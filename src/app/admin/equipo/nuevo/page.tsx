import TeamForm from "@/components/admin/TeamForm";

export default function NuevoPsicologoPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-text-primary mb-6">Agregar Psicologo</h1>
      <TeamForm mode="create" />
    </div>
  );
}
