export const handleKeyDown = (event, maxLength) => {
  if (
    (!/[0-9]/.test(event.key) &&
      event.key !== "Backspace" &&
      event.key !== "Delete" &&
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight" &&
      event.key !== "Tab") ||
    (/[0-9]/.test(event.key) && event.target.value.length >= maxLength)
  ) {
    event.preventDefault();
  }
};
