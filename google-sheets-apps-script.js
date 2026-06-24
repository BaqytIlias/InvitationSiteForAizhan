const SHEET_NAME = "RSVP";

function doPost(e) {
  const sheet = getOrCreateSheet_();
  const data = e.parameter || {};

  sheet.appendRow([
    new Date(),
    data.guestName || "",
    data.attendance || "",
    data.submittedAt || "",
    data.pageUrl || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Received At", "Guest Name", "Attendance", "Submitted At", "Page URL"]);
  }

  return sheet;
}
