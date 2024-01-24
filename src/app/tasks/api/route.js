import { google } from "googleapis";
import keys from '../../../../promptia-396220-e9972043fe80.json';

export async function GET() {
    try {
        const client = new google.auth.JWT(
            keys.client_email, null, keys.private_key, ['https://www.googleapis.com/auth/spreadsheets']
        );

        await client.authorize();
        
        const gsapi = google.sheets({ version: 'v4', auth: client });
        
        const optHeaders = {
            spreadsheetId: process.env.NEXT_SPREADSHEET_ID,
            range: 'Sheet1!1:1',
        };

        let headersResponse = await gsapi.spreadsheets.values.get(optHeaders);
        const headers = headersResponse.data.values[0];
        const lastColumn = String.fromCharCode('A'.charCodeAt(0) + headers.length - 1);
        const dynamicRange = `Sheet1!A2:${lastColumn}`;

        const optData = {
            spreadsheetId: process.env.NEXT_SPREADSHEET_ID,
            range: dynamicRange,
        };

        const dataResponse = await gsapi.spreadsheets.values.get(optData);
        return Response.json(dataResponse.data.values);
    } catch (e) {
        return Response.json(e.message);
    }
}