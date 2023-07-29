const getDate = () => {
  const date = new Date();
  const dateStr = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
  return dateStr;
};

const getTime = () => {
  const date = new Date();
  const timeStr = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return timeStr;
};

const consoleLog = (message) => {
  console.log(`---${message}--------:---------- ${getTime()}---`);
};

export { consoleLog, getDate };
