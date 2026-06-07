import SetorEditForm from "./SetorEditForm";

export async function generateStaticParams() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/setores`);
    const data = await response.json();
    const items = Array.isArray(data) ? data : data.data ?? [];
    return items.map((s: { id: number }) => ({ id: String(s.id) }));
  } catch {
    return [];
  }
}

export default async function EditarSetor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SetorEditForm id={id} />;
}
