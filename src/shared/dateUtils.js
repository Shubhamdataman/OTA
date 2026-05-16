// dateUtils.js

export const getServerDateTime = () => {
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = currentDate.toLocaleString("default", { month: "short" });
  const year = currentDate.getFullYear();
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");

  const dateFull = `${day}-${month}-${year} ${hours}.${minutes}`;
  const datePart = `${day}-${month}-${year}`;
  const timePart = `${hours}.${minutes}`;

  return [datePart, timePart, dateFull];
};

export const getServerTimestamp = () => {
  return new Date().toISOString();
};

export const getServerTimestampLong = () => {
  return new Date().getTime();
};

export const getUnixTimestamp = () => {
  return Math.floor(new Date().getTime()/ 1000);
};

export const convertDateToUnixTimestamp = (dateString) => {
  // Create a Date object from the ISO string (UTC midnight)
  const date = new Date(dateString);

  // Get the timestamp in milliseconds and convert to seconds
  return Math.floor(date.getTime() / 1000);
};
