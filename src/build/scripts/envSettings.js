const fsExtra = require('fs-extra');

function createEnvSettingsFile(settingsFile) {
    fsExtra.ensureFile(settingsFile).then((f) => {
        fsExtra.writeFileSync(
            settingsFile,
            `window.appSettings = {
                API_URL: '${process.env.API_URL}',
                LOGIN_URL: '${process.env.LOGIN_URL}',
                PUBLIC_PATH: '${process.env.PUBLIC_PATH}',
                UTILGJENGELIG: '${process.env.UTILGJENGELIG}',
                APP_VERSION: '${process.env.APP_VERSION}',
                APPSTATUS_PROJECT_ID: '${process.env.APPSTATUS_PROJECT_ID}',
                APPSTATUS_DATASET: '${process.env.APPSTATUS_DATASET}',
                USE_AMPLITUDE: '${process.env.USE_AMPLITUDE}',
                APP_VERSION: '${process.env.APP_VERSION}',
                KORONA_2021_PERIODE_ENABLED: '${process.env.KORONA_2021_PERIODE_ENABLED}',
            };`
        );
    });
}

module.exports = createEnvSettingsFile;
