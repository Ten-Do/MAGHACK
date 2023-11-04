import { useRef } from "react";

export const FilterField = ({ set }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  let timer;
  const handleTextChange = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      set(inputRef.current?.value || "");
    }, 1000);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Type something..."
        onChange={handleTextChange}
      />

      <p>Debounced Text: {inputRef.current?.value}</p>
    </div>
  );
};
