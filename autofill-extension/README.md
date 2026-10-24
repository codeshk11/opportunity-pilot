# OppPilot Form Autofill (Chrome)

This is a small local Chrome extension prototype. It fills matching, empty fields on the current opportunity application page using profile data exported from OppPilot. **It never submits the form**; the user must review the values and submit manually.

## Setup

1. In OppPilot, sign in and click **Export autofill profile** on the dashboard. Save the JSON file.
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select the `autofill-extension` folder from this repository.
5. Open the extension, import the downloaded JSON, and open an opportunity's application form.
6. Click the extension icon and choose **Fill this page**.
7. Review every field, correct anything that is wrong, and submit manually on the opportunity website.

## Important limitations

- It only fills fields whose visible label, placeholder, or field name resembles a known profile field. Websites with custom controls or unclear labels may not work.
- The extension fills only empty fields and does not touch password, file, payment, or submit controls.
- The profile JSON contains personal education/background details. Keep it private and delete it when no longer needed.
- The profile is stored locally in Chrome extension storage. Use **Clear saved profile** to remove it.
- The extension does not send profile data to OppPilot or any third party while filling a form.
- This is a prototype and should be tested on sample forms before relying on it for real applications.
