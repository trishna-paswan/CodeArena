import ClassClient from "./ClassClient";

export function generateStaticParams() {
  return [
    { id: '6' },
    { id: '7' },
  ];
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ClassClient params={params} />;
}
