function doPost(e) {
  let ss = SpreadsheetApp.openById("1-XCtEWJnsWOgV7P-9ubDbg_JcOVaz16rWZi5F48_HlI");
  let mainSheet = ss.getSheetByName("CTW");
  let sheetErrors = ss.getSheetByName("Erros");
  let sheetScriptErrors = ss.getSheetByName("Erros App Script");
  let sheetLogs = ss.getSheetByName("Logs");
  let sheetCNC = ss.getSheetByName("CNC");

  if (!mainSheet) {
    mainSheet = ss.insertSheet("CTW");
    mainSheet.appendRow(["ID", "Data", "Nome", "Telefone", "URL", "Titulo", "ID Do Anuncio", "Transbordo"]);
  }

  if (!sheetCNC) {
    sheetCNC = ss.insertSheet("CNC");
    sheetCNC.appendRow(["ID", "Data", "Nome", "Telefone"]);
  }

  let sheet = mainSheet;
  let date = new Date();
  let formattedDate = Utilities.formatDate(date, "GMT-3", "dd/MM/yyyy HH:mm:ss");
  let idValuesCTW = mainSheet.getRange("A:A").getValues().flat();
  idValuesCTW.shift();
  let idCTW = idValuesCTW.length > 0 ? Math.max(...idValuesCTW) : 0;
  idCTW++;
  let idValuesCNC = sheetCNC.getRange("A:A").getValues().flat();
  idValuesCNC.shift();
  let idCNC = idValuesCNC.length > 0 ? Math.max(...idValuesCNC) : 0;
  idCNC++;
  let transbordoCTW = idCTW % 2 === 0 ? "CRM" : "Digital";
  let transbordoCNC = idCNC % 2 === 0 ? "CRM" : "Digital";

  try {
    let dados = JSON.parse(e.postData.contents);

    let colunasCTW = {
      "id": "A",
      "data": "B",
      "nome": "C",
      "telefone": "D",
      "url": "E",
      "titulo": "F",
      "id Do Anuncio": "G",
      "transbordo": "H"
    };

    let colunasCNC = {
      "id": "A",
      "data": "B",
      "nome": "C",
      "telefone": "D"
    };

    let dadosInsercaoCTW = {
      "id": idCTW,
      "data": formattedDate,
      "nome": dados.nome ? dados.nome : 'null',
      "telefone": dados.telefone ? dados.telefone : 'null',
      "url": dados.url ? dados.url : 'null',
      "titulo": dados.titulo ? dados.titulo : 'null',
      "id Do Anuncio": dados.id_Do_Anuncio ? dados.id_Do_Anuncio : 'null',
      "transbordo": transbordoCTW
    };

    let dadosInsercaoCNC = {
      "id": idCNC,
      "data": formattedDate,
      "nome": dados.nome ? dados.nome : 'null',
      "telefone": dados.telefone ? dados.telefone : 'null'
    };

    if (
      (dados.url === '' || dados.url === undefined || dados.url === 'null' || dados.url === null) ||
      (dados.titulo === '' || dados.titulo === undefined || dados.titulo === 'null' || dados.titulo === null)
    ) {
      sheet = sheetCNC;
      sheet.insertRowBefore(2);

      for (let coluna in dadosInsercaoCNC) {
        sheet.getRange(colunasCNC[coluna] + '2').setValue(dadosInsercaoCNC[coluna]);
      }
    } else {
      mainSheet.insertRowBefore(2);

      for (let coluna in dadosInsercaoCTW) {
        mainSheet.getRange(colunasCTW[coluna] + '2').setValue(dadosInsercaoCTW[coluna]);
      }
      mainSheet.getRange("A2").setValue(idCTW);
    }

  } catch (error) {
    Logger.log(error);
    sheet = sheetScriptErrors;
    sheet.insertRowBefore(2);
    sheet.getRange('A2').setValue(formattedDate);
    sheet.getRange('B2').setValue(error);

    sendMail(formattedDate, error);
  } finally {
    sheet = sheetLogs;
    sheet.insertRowBefore(2);
    sheet.getRange('A2').setValue(formattedDate);
    sheet.getRange('B2').setValue('Success');
    Logger.log('transbordo CTW:', transbordoCTW);
    Logger.log('transbordo CNC:', transbordoCNC);
    return ContentService.createTextOutput(transbordoCTW);
  }
}
