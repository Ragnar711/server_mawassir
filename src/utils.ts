export const getPoste = () => {
  const now = new Date();

  if (now.getHours() > 6 && now.getHours() < 14) {
    return 'Matin';
  } else if (now.getHours() > 14 && now.getHours() < 22) {
    return 'Soir';
  } else {
    return 'Nuit';
  }
};

export const formatTime = (seconds: number) => {
  const date = new Date(0);
  date.setSeconds(seconds);

  const pad = (n: number) => (n < 10 ? '0' + n : n);

  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};
