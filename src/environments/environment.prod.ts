export const environment = {
  production: true,
    signalR: {
    hubName: 'watchdoghub',
    functionKey: 'mysignalrfunckey',
    watchdogUrl: 'http://localhost:7071/api',
    negotiateEndPoint: '/negotiate2',
    // Note: The clientKey value must be consistent with the app that's employing the C# client library.
    // Please see the integration test committed under this issue: https://github.com/grainfabric/grainfabricdotnetclient/issues/63
    clientKey: 'integrationtest'
  }
};
