// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  signalR: {
    hubName: 'watchdoghub',
    functionKey: 'ckFmEOWWULKwUvnjBg1j239tke4qnvlJyzzXic6NSUHntYT3jpw01A==',
    watchdogUrl: 'https://gfdemowatchdog.azurewebsites.net/api',
    negotiateEndPoint: '/negotiate2',
    // Note: The clientKey value must be consistent with the app that's employing the C# client library.
    // Please see the integration test committed under this issue: https://github.com/grainfabric/grainfabricdotnetclient/issues/63
    clientKey: 'integrationtest'
  }
};
