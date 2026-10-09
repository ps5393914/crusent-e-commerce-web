const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config();

const TOKEN_PATH = path.join(__dirname, '../data/google_token.json');

const getOAuth2Client = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
};

const getAuthUrl = () => {
  const oauth2Client = getOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.file']
  });
};

const saveToken = async (code) => {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  return tokens;
};

const getDriveClient = () => {
  const oauth2Client = getOAuth2Client();
  if (fs.existsSync(TOKEN_PATH)) {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    oauth2Client.setCredentials(tokens);
    return google.drive({ version: 'v3', auth: oauth2Client });
  }
  return null;
};

// We will sync users.json to drive. We need a way to store the fileId so we can update it.
const FILE_ID_PATH = path.join(__dirname, '../data/drive_file_id.json');

const syncUsersToDrive = async () => {
  const drive = getDriveClient();
  if (!drive) {
    console.log('Google Drive not authenticated yet. Skipping sync.');
    return;
  }

  const usersPath = path.join(__dirname, '../data/users.json');

  try {
    // 1. Find the folder named 'Crusent'
    const folderRes = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.folder' and name='Crusent' and trashed=false",
      fields: 'files(id, name)',
      spaces: 'drive'
    });
    
    let folderId = null;
    if (folderRes.data.files.length > 0) {
      folderId = folderRes.data.files[0].id;
      console.log('Found Crusent folder with ID:', folderId);
    } else {
      console.log('Folder "Crusent" not found on Google Drive. Saving to root.');
    }

    const fileMetadata = {
      name: 'crusent_users.json',
      mimeType: 'application/json'
    };
    if (folderId) {
      fileMetadata.parents = [folderId];
    }
    
    const media = {
      mimeType: 'application/json',
      body: fs.createReadStream(usersPath)
    };

    if (fs.existsSync(FILE_ID_PATH)) {
      const { fileId } = JSON.parse(fs.readFileSync(FILE_ID_PATH, 'utf-8'));
      
      let fileRes;
      try {
        fileRes = await drive.files.get({ fileId: fileId, fields: 'parents' });
      } catch (err) {
        // File might have been deleted, remove the ID file and re-sync
        fs.unlinkSync(FILE_ID_PATH);
        return syncUsersToDrive();
      }

      const previousParents = fileRes.data.parents ? fileRes.data.parents.join(',') : '';
      
      let updateParams = {
        fileId: fileId,
        media: media
      };

      if (folderId && !fileRes.data.parents?.includes(folderId)) {
         updateParams.addParents = folderId;
         if (previousParents) {
             updateParams.removeParents = previousParents;
         }
      }

      await drive.files.update(updateParams);
      console.log('Successfully updated users.json on Google Drive in Crusent folder.');
    } else {
      // Create new file
      const file = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
      });
      fs.writeFileSync(FILE_ID_PATH, JSON.stringify({ fileId: file.data.id }));
      console.log('Successfully created users.json on Google Drive with ID:', file.data.id);
    }
  } catch (error) {
    console.error('Error syncing to Google Drive:', error.message);
  }
};

module.exports = {
  getAuthUrl,
  saveToken,
  syncUsersToDrive,
  getDriveClient
};
