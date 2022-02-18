/* eslint-disable */

var shared, worker, init;
function define(_, chunk) {
    if (!shared) {
        shared = chunk;
    } else if (!worker) {
        worker = chunk;
    } else {
        init = chunk;
        if (window.iitcLoaded && typeof setup === "function") 
            setup();
    }
}

if (typeof window.plugin !== "function") {
    window.plugin = function () {};
}

window.plugin.Wasabee = window.plugin.wasabee = {};
window.plugin.wasabee.info = {
    name: "Wasabee Draw Tools",
    description: "Wasabee is not for dating",
    version: __buildVersion__,
};

function setup() {
    var workerBundleString = 'var sharedChunk = {}; (' + shared + ')(sharedChunk); (' + worker + ')(sharedChunk);'

    var sharedChunk = {};
    shared(sharedChunk);
    init(sharedChunk);
    window.plugin.wasabee.workerUrl = window.URL.createObjectURL(new Blob([workerBundleString], { type: 'text/javascript' }));
    window.plugin.wasabee.init();
}

setup.info = { script: window.plugin.wasabee.info };
if (!window.bootPlugins) {
  window.bootPlugins = [];
}
window.bootPlugins.push(setup);