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
