function sendMail(formattedDate, error) {
  const rep = 'yago.rodrigues@haaify.com'; 'ennisten.mudado@haaify.com';
  const sub = 'Erro teste';
  const message = `Ocorreu um na Planilha CTW (Lucy Home) erro na data ${formattedDate}.\n${error}`;
  GmailApp.sendEmail(rep, sub, message);
}
