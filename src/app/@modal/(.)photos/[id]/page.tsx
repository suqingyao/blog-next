interface Props {
  params: { id: string };
}

export default function PhotosModalPage({ params }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <img
        src={`/api/photos/${params.id}`}
        alt={params.id}
      />
    </div>
  );
}
