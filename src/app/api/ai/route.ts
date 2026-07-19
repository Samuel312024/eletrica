import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `Você é o assistente de engenharia elétrica da plataforma EletroTech.
Ajuda engenheiros, projetistas e técnicos com:
- Explicações técnicas claras (normas ABNT, principalmente NBR 5410, NBR 5419, NBR 14039);
- Apoio ao dimensionamento (condutores, disjuntores, quedas de tensão, aterramento) — sempre
  mostrando o raciocínio e citando a referência normativa usada, nunca só o resultado final;
- Revisão crítica de projetos, apontando riscos, inconsistências e não conformidades;
- Geração de estrutura de diagramas unifilares/trifilares em formato descritivo.

Responda em português do Brasil, de forma direta e tecnicamente precisa. Quando um cálculo
depender de dados que não foram informados (ex.: comprimento do circuito, temperatura ambiente,
tipo de instalação), pergunte antes de assumir valores. Deixe claro quando uma resposta precisa
ser conferida por um responsável técnico antes de ir para execução — você apoia a decisão, não
substitui a responsabilidade técnica (ART) do profissional.`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY não configurada no servidor.' },
      { status: 500 }
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Corpo da requisição inválido.' }, { status: 400 });
  }

  const messages = body.messages ?? [];
  if (messages.length === 0) {
    return NextResponse.json({ error: 'Nenhuma mensagem enviada.' }, { status: 400 });
  }

  const anthropic = new Anthropic({ apiKey });

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const text = response.content
      .map((block) => (block.type === 'text' ? block.text : ''))
      .filter(Boolean)
      .join('\n');

    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error('Erro ao chamar a Anthropic API:', err);
    return NextResponse.json(
      { error: 'Falha ao consultar o assistente de IA. Tente novamente.' },
      { status: 502 }
    );
  }
}
