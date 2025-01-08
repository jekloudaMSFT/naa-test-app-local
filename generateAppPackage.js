const archiver = require('archiver');
const fs = require('fs');

const manifest = `{
  "$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.15/MicrosoftTeams.schema.json",
  "manifestVersion": "1.15",
  "version": "1.0.0",
  "id": "e5881c79-58dd-47af-889b-726eaeb51bc6",
  "packageName": "com.microsoft.teams.extension",
  "developer": {
      "name": "Teams App, Inc.",
      "websiteUrl": "${process.env.APP_URL}",
      "privacyUrl": "${process.env.APP_URL}",
      "termsOfUseUrl": "${process.env.APP_URL}"
  },
  "icons": {
      "color": "color.png",
      "outline": "outline.png"
  },
  "name": {
      "short": "naa-test-app-local",
      "full": "Full name for naa-test-app"
  },
  "description": {
      "short": "Short description of naa-test-app",
      "full": "Full description of naa-test-app"
  },
  "accentColor": "#FFFFFF",
  "bots": [],
  "composeExtensions": [],
  "configurableTabs": [],
  "staticTabs": [
      {
          "entityId": "index",
          "name": "Personal Tab",
          "contentUrl": "${process.env.APP_URL}",
          "websiteUrl": "${process.env.APP_URL}",
          "scopes": [
              "personal"
          ]
      }
  ],
  "permissions": [
      "identity",
      "messageTeamMembers"
  ],
  "validDomains": [
      "${process.env.APP_DOMAIN}"
  ]
}`;

fs.writeFileSync('appPackage/manifest.json', manifest);

var output = fs.createWriteStream('appPackage.zip');
var archive = archiver('zip');

output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function(err){
    throw err;
});

archive.pipe(output);

// append files from a sub-directory, putting its contents at the root of archive
archive.directory("appPackage", false);

archive.finalize();
