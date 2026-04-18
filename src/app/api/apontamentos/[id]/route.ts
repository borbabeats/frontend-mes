import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Construir URL da API real
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const apiUrl = new URL(`/apontamentos/${id}`, apiBaseUrl);
    
    console.log('Buscando apontamento da API real:', apiUrl.toString());
    
    // Fazer requisição para a API real
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Apontamento não encontrado' },
          { status: 404 }
        );
      }
      throw new Error(`Erro na API real: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Erro ao buscar apontamento:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Construir URL da API real
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const apiUrl = new URL(`/apontamentos/${id}`, apiBaseUrl);
    
    console.log('Atualizando apontamento na API real:', apiUrl.toString(), body);
    
    // Fazer requisição para a API real
    const response = await fetch(apiUrl.toString(), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Apontamento não encontrado' },
          { status: 404 }
        );
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro na API real: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Erro ao atualizar apontamento:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Construir URL da API real
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const apiUrl = new URL(`/apontamentos/${id}`, apiBaseUrl);
    
    console.log('Excluindo apontamento na API real:', apiUrl.toString());
    
    // Fazer requisição para a API real
    const response = await fetch(apiUrl.toString(), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Apontamento não encontrado' },
          { status: 404 }
        );
      }
      throw new Error(`Erro na API real: ${response.status}`);
    }
    
    return NextResponse.json(
      { message: 'Apontamento excluído com sucesso' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Erro ao excluir apontamento:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
