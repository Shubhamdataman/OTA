export const formatDateToCustom = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('en', { month: 'short' });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const formatDateToAPI = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en', { month: 'short' });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};