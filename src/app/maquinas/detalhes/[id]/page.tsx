import MaquinaForm from "../MaquinaForm";

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

export default async function MaquinaDetalhes({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MaquinaForm id={id} />;
}
