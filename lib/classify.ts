import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface ClassificationResult {
  quadrant: "DO" | "PLAN" | "DELEGATE" | "ELIMINATE";
  confidence: number;
  reasoning: string;
}

export async function classifyTask(
  title: string,
  description?: string,
  deadline?: string,
): Promise<ClassificationResult> {
  const today = new Date().toISOString().split("T")[0];

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Clasifica esta tarea en la matriz de Eisenhower.

Fecha de hoy: ${today}

Tarea:
- Título: ${title}
${description ? `- Descripción: ${description}` : ""}
${deadline ? `- Fecha límite: ${deadline}` : "- Sin fecha límite"}

Criterios:
- URGENTE: tiene deadline próximo (menos de 48h), alguien lo espera, hay consecuencias inmediatas si no se hace
- IMPORTANTE: contribuye a objetivos a largo plazo, tiene impacto significativo, no es reemplazable

Cuadrantes:
- DO: urgente + importante → hacer ya
- PLAN: importante pero no urgente → agendar
- DELEGATE: urgente pero no importante → se puede delegar o automatizar
- ELIMINATE: ni urgente ni importante → eliminar o posponer indefinidamente

Responde SOLO con JSON válido, sin markdown ni texto adicional:
{
  "quadrant": "DO" | "PLAN" | "DELEGATE" | "ELIMINATE",
  "confidence": 0.0 a 1.0,
  "reasoning": "explicación breve en español"
}`,
        },
      ],
      max_tokens: 300,
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0]?.message?.content ?? "";
    return JSON.parse(text);
  } catch (err) {
    console.error("Error clasificando tarea con IA:", err);
    return {
      quadrant: "PLAN",
      confidence: 0,
      reasoning:
        "No se pudo clasificar automáticamente. Clasifica manualmente.",
    };
  }
}
