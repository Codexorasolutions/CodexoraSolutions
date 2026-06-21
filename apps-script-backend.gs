/**
 * CODEXORA SOLUTIONS — Contact Form Backend
 * Deploy this from: Google Sheet → Extensions → Apps Script
 *
 * SETUP:
 * 1. Paste your reCAPTCHA SECRET KEY below (from google.com/recaptcha/admin)
 * 2. Click Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 3. Copy the Web App URL it gives you — paste that into contact.html (GOOGLE_SCRIPT_URL)
 * 4. Re-deploy (New Deployment, not "manage deployments") every time you edit this file
 */

const RECAPTCHA_SECRET_KEY = '6LdPiCstAAAAABka0n3Zo88yZGAGKdhvpbbI4Qor'; // ⚠️ paste your Secret Key here
const SHEET_NAME = 'Enquiries'; // the tab name inside your Google Sheet

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // ── 1. Verify reCAPTCHA token with Google ──
    const captchaToken = data.captchaToken;
    if (!captchaToken) {
      return jsonResponse({ success: false, error: 'Missing captcha token.' });
    }

    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const verifyResponse = UrlFetchApp.fetch(verifyUrl, {
      method: 'post',
      payload: {
        secret: RECAPTCHA_SECRET_KEY,
        response: captchaToken
      },
      muteHttpExceptions: true
    });
    const verifyResult = JSON.parse(verifyResponse.getContentText());

    if (!verifyResult.success) {
      return jsonResponse({ success: false, error: 'Captcha verification failed. Please try again.' });
    }

    // ── 2. Basic required-field validation ──
    if (!data.name || !data.phone || !data.business) {
      return jsonResponse({ success: false, error: 'Missing required fields.' });
    }

    // ── 3. Write to the Sheet ──
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Ticket ID', 'Timestamp', 'Name', 'Phone', 'Email',
        'Business', 'Business Type', 'Plan Interested', 'Message'
      ]);
      sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
    }

    const ticketId = 'CX-' + Date.now().toString(36).toUpperCase();
    const timestamp = new Date();

    sheet.appendRow([
      ticketId,
      timestamp,
      data.name,
      data.phone,
      data.email || '',
      data.business,
      data.type || '',
      data.plan || '',
      data.message || ''
    ]);

    return jsonResponse({ success: true, ticketId: ticketId });

  } catch (err) {
    return jsonResponse({ success: false, error: 'Server error: ' + err.message });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Optional: lets you open the Web App URL in a browser to sanity-check it's alive
function doGet() {
  return ContentService.createTextOutput('Codexora enquiry endpoint is live.');
}
