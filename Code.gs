function updateData()
{
  const csvData = Utilities.parseCsv(DriveApp.getFilesByName("UPC codes.csv").next().getBlob().getDataAsString());
  const output = csvData.map(u => [u[0], u[1] + '\n\n' + u[2] + '\nSKU # ' + u[5] + '\nPrice $' + u[4] + ' ' + u[3] + '\n\n' + u[6] + ' in Richmond\n' + u[7] + ' in Parksville\n' + u[8] + ' in Rupert'])
  output[0][1] = 'Item Information'
  SpreadsheetApp.getActive().getSheetByName('UPC Database').clearContents().getRange(1, 1, output.length, output[0].length).setNumberFormat('@').setValues(output)
}

function onEdit(e)
{
  const spreadsheet = e.source;

  if (spreadsheet.getActiveSheet().getSheetName() === 'Scan')
  {
    const barcodeInputRange = e.range;
    const upcSheet = spreadsheet.getSheetByName('UPC Database');
    const items = upcSheet.getSheetValues(2, 1, upcSheet.getLastRow() - 1, 1)
    const upcCode = barcodeInputRange.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP)
      .setFontFamily("Arial").setFontColor("black").setFontSize(18)
      .setVerticalAlignment("middle").setHorizontalAlignment("center").setNumberFormat('@')
      .getValue();

    for (var i = 0; i < items.length; i++)
    {
      if (items[i][0] === upcCode) // The scanned value
      {
        barcodeInputRange.setValue(upcSheet.getSheetValues(i + 2, 2, 1, 1)[0][0])    
        break;
      }
    }

    if (i === items.length)
      barcodeInputRange.setValue('Barcode Not Found')
  }
}