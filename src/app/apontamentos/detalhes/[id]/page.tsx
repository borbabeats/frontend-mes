import ApontamentoDetalhes from "../ApontamentoDetalhes";

export async function generateStaticParams() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apontamentos`);
    const data = await response.json();
    const items = Array.isArray(data) ? data : data.data ?? [];
    return items.map((a: { id: number }) => ({ id: String(a.id) }));
  } catch {
    return [];
  }
}

export default async function DetalhesApontamento({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ApontamentoDetalhes id={id} />;
}
