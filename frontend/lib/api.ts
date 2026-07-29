const aiServiceUrl =
  process.env.NEXT_PUBLIC_AI_SERVICE_URL ?? "http://localhost:8000";

export async function getAiServiceHealth(): Promise<{ status: string }> {
  const response = await fetch(`${aiServiceUrl}/health`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("AI service is unavailable");
  }

  return response.json() as Promise<{ status: string }>;
}

