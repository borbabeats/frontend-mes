import MaquinaEditForm from "./MaquinaEditForm";

export async function generateStaticParams() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/maquinas`);
    const data = await response.json();
    const items = Array.isArray(data) ? data : data.data ?? [];
    return items.map((m: { id: number }) => ({ id: String(m.id) }));
  } catch {
    return [];
  }
}

export default async function EditarMaquina({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MaquinaEditForm id={id} />;
}
