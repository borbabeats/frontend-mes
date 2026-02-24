import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Construir URL da API real com parâmetros
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiUrl = new URL('/apontamentos', apiBaseUrl);
    
    // Transferir parâmetros para a API real
    searchParams.forEach((value, key) => {
      apiUrl.searchParams.append(key, value);
    });
    
    // Fazer requisição para a API real
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Erro da API real:', response.status, response.statusText);
      throw new Error(`Erro na API real: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Erro ao buscar apontamentos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Construir URL da API real
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiUrl = new URL('/apontamentos', apiBaseUrl);
    
    // Fazer requisição para a API real
    const response = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      console.error('Erro da API real:', response.status, response.statusText);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro na API real: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data, { status: 201 });
    
  } catch (error) {
    console.error('Erro ao criar apontamento:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
