import OrdemProducaoEditForm from "./OrdemProducaoEditForm";

export async function generateStaticParams() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordens-producao`);
    const data = await response.json();
    const items = Array.isArray(data) ? data : data.data ?? [];
    return items.map((o: { id: number }) => ({ id: String(o.id) }));
  } catch {
    return [];
  }
}

export default async function EditarOrdemProducao({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrdemProducaoEditForm id={id} />;
}
