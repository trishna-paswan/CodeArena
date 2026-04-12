import ClassClient from "./ClassClient";

export function generateStaticParams() {
  return [
    { id: '6' }, { id: '7' }, { id: '8' }, { id: '9' },
    { id: '10' }, { id: '11' }, { id: '12' }
  ];
}

export default function Page() {
  return <ClassClient />;
}
