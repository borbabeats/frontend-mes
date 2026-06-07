import UsuarioDetalhes from "./UsuarioDetalhes";

export async function generateStaticParams() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`);
    const data = await response.json();
    const items = Array.isArray(data) ? data : data.data ?? [];
    return items.map((u: { id: number }) => ({ id: String(u.id) }));
  } catch {
    return [];
  }
}

export default async function DetalhesUsuario({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UsuarioDetalhes id={id} />;
}
