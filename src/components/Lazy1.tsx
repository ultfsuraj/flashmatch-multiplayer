const Lazy1 = ({ index, onClick }: { index: number; onClick: () => void }) => {
  return (
    <div className="rounded-lg bg-pink-950 px-2 py-1 font-semibold text-white" onClick={() => onClick()}>
      Lazy {index}
    </div>
  );
};

export default Lazy1;
