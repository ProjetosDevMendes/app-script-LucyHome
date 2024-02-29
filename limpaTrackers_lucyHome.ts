function doPost(e) {
  const ss = SpreadsheetApp.openById("1-XCtEWJnsWOgV7P-9ubDbg_JcOVaz16rWZi5F48_HlI");
  let mainSheet = ss.getSheetByName("CTW") || ss.insertSheet("CTW", ss.getSheets().length);
  let cncSheet = ss.getSheetByName("CNC") || ss.insertSheet("CNC", ss.getSheets().length);
  let sheetLogs = ss.getSheetByName("Logs") || ss.insertSheet("Logs", ss.getSheets().length);
  let sheetScriptErrors = ss.getSheetByName("Erros App Script") || ss.insertSheet("Erros App Script", ss.getSheets().length);

  setupSheet(mainSheet, ["ID", "Data", "Nome", "Telefone", "URL", "Titulo", "ID Do Anuncio"]);
  setupSheet(cncSheet, ["ID", "Data", "Nome", "Telefone"]);
  setupSheet(sheetLogs, ["Data", "Status"]);
  setupSheet(sheetScriptErrors, ["Data", "Erro"]);

  if (!e.postData || !e.postData.contents) {
    logError(sheetScriptErrors, "Dados de postagem não fornecidos ou inválidos.");
    return ContentService.createTextOutput("Erro: Dados de postagem não fornecidos ou inválidos.");
  }

  try {
    const dados = JSON.parse(e.postData.contents);
    const formattedDate = Utilities.formatDate(new Date(), "GMT-3", "dd/MM/yyyy HH:mm:ss");

    if (dados.url) {
      const nextId = getNextId(mainSheet);
      mainSheet.appendRow([
        nextId,
        formattedDate,
        dados.nome || 'null',
        dados.telefone || 'null',
        dados.url,
        dados.titulo || 'null',
        dados.id_Do_Anuncio || 'null'
      ]);
    } else {
      const nextId = getNextId(cncSheet);
      cncSheet.appendRow([
        nextId,
        formattedDate,
        dados.nome || 'null',
        dados.telefone || 'null'
      ]);
    }

    sheetLogs.appendRow([formattedDate, "Sucesso"]);
    return ContentService.createTextOutput("Inserção realizada com sucesso.");
  } catch (error) {
    logError(sheetScriptErrors, error.toString());
    return ContentService.createTextOutput("Erro ao processar a solicitação.");
  }
}

function getNextId(sheet) {
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const lastRow = values.length > 1 ? values[values.length - 1] : [0]; // Ajustado para considerar folha vazia
  const lastId = lastRow[0];
  return Number(lastId) + 1;
}

function setupSheet(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
}

function logError(sheet, errorMessage) {
  const formattedDate = Utilities.formatDate(new Date(), "GMT-3", "dd/MM/yyyy HH:mm:ss");
  sheet.appendRow([formattedDate, errorMessage]);
}
