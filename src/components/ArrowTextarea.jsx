const { Textarea } = require("./ui/textarea");

export const ArrowTextarea = ({ value, onChange, ...props }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const textBeforeCursor = e.target.value.substring(
        0,
        e.target.selectionStart
      );
      const textAfterCursor = e.target.value.substring(e.target.selectionEnd);

      // Jika baris sebelumnya sudah ada panah, tambahkan panah di baris baru
      if (
        textBeforeCursor.trim().startsWith("➡️") ||
        textBeforeCursor.trim() === ""
      ) {
        onChange(
          e.target.value.substring(0, e.target.selectionStart) +
            "\n➡️ " +
            e.target.value.substring(e.target.selectionEnd)
        );
      } else {
        onChange(
          e.target.value.substring(0, e.target.selectionStart) +
            "\n➡️ " +
            e.target.value.substring(e.target.selectionEnd)
        );
      }
    }
  };

  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
};
