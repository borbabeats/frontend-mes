import ManutencaoDetalhes from "../ManutencaoDetalhes";

export async function generateStaticParams() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/manutencoes`);
    const data = await response.json();
    const items = Array.isArray(data) ? data : data.data ?? [];
    return items.map((m: { id: number }) => ({ id: String(m.id) }));
  } catch {
    return [];
  }
}

export default async function DetalhesManutencao({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ManutencaoDetalhes id={id} />;
}
