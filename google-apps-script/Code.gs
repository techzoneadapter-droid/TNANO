const SHEET_COLOR_CONSULT = "TU_VAN_MAU";
const SHEET_DEALER = "DANG_KY_DAI_LY";

const COLOR_HEADERS = [
  "Thời gian",
  "Họ tên",
  "Số điện thoại",
  "Diện tích",
  "Nhu cầu quan tâm",
  "UTM Source",
  "UTM Campaign",
  "UTM Content",
  "Landing Page",
];

const DEALER_HEADERS = [
  "Thời gian",
  "Họ tên",
  "Số điện thoại",
  "Tỉnh/Thành phố",
  "UTM Source",
  "UTM Campaign",
  "UTM Content",
  "Landing Page",
];

function doPost(e) {
  try {
    const data = parsePayload_(e);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const submittedAt = data.created_at ? new Date(data.created_at) : new Date();

    if (data.type === "color-consult") {
      const sheet = getOrCreateSheet_(spreadsheet, SHEET_COLOR_CONSULT, COLOR_HEADERS);

      sheet.appendRow([
        submittedAt,
        data.name || "",
        data.phone || "",
        data.area || "",
        data.interest || "",
        data.utm_source || data.utmSource || "",
        data.utm_campaign || data.utmCampaign || "",
        data.utm_content || data.utmContent || "",
        data.landing_page || data.landingPage || "",
      ]);

      return json_({ ok: true });
    }

    if (data.type === "dealer") {
      const sheet = getOrCreateSheet_(spreadsheet, SHEET_DEALER, DEALER_HEADERS);

      sheet.appendRow([
        submittedAt,
        data.name || "",
        data.phone || "",
        data.province || "",
        data.utm_source || data.utmSource || "",
        data.utm_campaign || data.utmCampaign || "",
        data.utm_content || data.utmContent || "",
        data.landing_page || data.landingPage || "",
      ]);

      return json_({ ok: true });
    }

    return json_({ ok: false, error: "Invalid type" });
  } catch (error) {
    return json_({ ok: false, error: String(error) });
  }
}

function parsePayload_(e) {
  if (!e) return {};

  if (e.postData && e.postData.contents) {
    const contents = e.postData.contents;
    const type = e.postData.type || "";

    if (type.indexOf("application/json") !== -1 || contents.charAt(0) === "{") {
      return JSON.parse(contents);
    }
  }

  return e.parameter || {};
}

function getOrCreateSheet_(spreadsheet, name, headers) {
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
  }

  ensureHeaders_(sheet, headers);
  return sheet;
}

function ensureHeaders_(sheet, headers) {
  const lastColumn = sheet.getLastColumn();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  } else {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    if (lastColumn > headers.length) {
      sheet.getRange(1, headers.length + 1, 1, lastColumn - headers.length).clearContent();
    }
  }

  sheet.setFrozenRows(1);
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
