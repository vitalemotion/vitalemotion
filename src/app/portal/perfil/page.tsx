import ProfileForm from "@/components/portal/ProfileForm";

export default function PerfilPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-text-primary mb-6">Mi Perfil</h1>
      <div className="max-w-2xl">
        <ProfileForm />
      </div>
    </div>
  );
}
