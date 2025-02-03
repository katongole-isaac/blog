const ProgressBar = () => {
  return (
    <div className="w-full h-[2px] bg-gray-200 dark:bg-neutral-900 overflow-hidden">
      <div className="h-full bg-gradient-to-r from-purple-500 to-rose-500 animate-progress" />
    </div>
  );
};

export default ProgressBar;
