type CanvasPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CanvasPage({ params }: CanvasPageProps) {
  const { id } = await params;

  return (
    <main className="content-page">
      <p className="eyebrow">Infinite Canvas</p>
      <h1>Canvas {id}</h1>
      <p>Vùng kéo thả artwork sẽ được triển khai sau skeleton Day 1.</p>
    </main>
  );
}

