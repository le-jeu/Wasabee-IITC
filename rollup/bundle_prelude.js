/* eslint-disable */

var init;
function define(/*_, */chunk) {
    init = chunk;
    if (window.iitcLoaded && typeof setup === "function") 
        setup();
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
    var sharedChunk = {};
    var wasabee = init(sharedChunk);
    window.plugin.wasabee.init();
}

setup.info = { script: window.plugin.wasabee.info };
if (!window.bootPlugins) {
  window.bootPlugins = [];
}
window.bootPlugins.push(setup);