import LevelClient from "./LevelClient";

export function generateStaticParams() {
  return [
    { id: "6-1" }, { id: "6-2" }, { id: "6-3" }, { id: "6-4" }, { id: "6-5" },
    { id: "7-1" }, { id: "7-2" }, { id: "7-3" }, { id: "7-4" }, { id: "7-5" }
  ];
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <LevelClient params={params} />;
}
