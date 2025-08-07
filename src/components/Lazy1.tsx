const Lazy1 = ({ index }: { index: number }) => {
  new Promise<void>((resolve) => setTimeout(() => resolve(), 2000));

  return <div className="rounded-lg bg-pink-950 px-2 py-1 font-semibold text-white">Lazy {index}</div>;
};

export default Lazy1;

export type Lazy1Type = typeof Lazy1;
