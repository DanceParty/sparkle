export default function GamePage({ params }: { params: { id: string } }) {
  return <div>{params.id}</div>;
}
