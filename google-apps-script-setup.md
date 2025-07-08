# Google Apps Script Setup for Tech for Girls Registration

## Step 1: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Tech for Girls Registration"
4. Add these column headers in row 1:
   - A1: Name
   - B1: Phone
   - C1: Email
   - D1: College
   - E1: File Name
   - F1: Submission Date

## Step 2: Create Google Apps Script
1. In your Google Sheet, go to Extensions > Apps Script
2. Replace the default code with the following:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = e.parameter;
    
    // Get current date
    const date = new Date();
    
    // Add row to sheet
    sheet.appendRow([
      data.name,
      data.phone,
      data.email,
      data.college,
      data.file || 'No file uploaded',
      date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Step 3: Deploy the Script
1. Click the "Deploy" button in the Apps Script editor
2. Choose "New deployment"
3. Select "Web app" as the type
4. Set these options:
   - Execute as: Me
   - Who has access: Anyone
5. Click "Deploy"
6. Copy the Web App URL

## Step 4: Update the React App
1. In your React app, find this line in App.tsx:
   ```javascript
   // Replace this URL with your Google Apps Script Web App URL
   // await fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
   ```

2. Replace it with:
   ```javascript
   await fetch('YOUR_ACTUAL_GOOGLE_APPS_SCRIPT_URL', {
     method: 'POST',
     body: formDataToSend
   });
   ```

## Step 5: Test the Integration
1. Submit a test registration through your form
2. Check your Google Sheet to see if the data appears
3. If there are issues, check the Apps Script logs for errors

## Notes:
- File uploads will show the file name only (actual file upload to Google Drive requires additional setup)
- To handle actual file uploads, you'll need to modify the Apps Script to save files to Google Drive
- Make sure your Google Apps Script has the necessary permissions