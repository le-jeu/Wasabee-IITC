import { initCrossLinks } from "./crosslinks";
import initServer from "./server";
import { setupLocalStorage, initSelectedOperation } from "./selectedOp";
import {
  drawMap,
  drawAgents,
  drawBackgroundOps,
  drawBackgroundOp,
} from "./mapDrawing";
import addButtons from "./addButtons";
import { setupToolbox } from "./toolbox";
import { initFirebase, postToFirebase } from "./firebaseSupport";
import { initWasabeeD } from "./wd";
import { listenForPortalDetails, sendLocation } from "./uiCommands";
import { initSkin, changeSkin } from "./skin";
import { WPane } from "./leafletClasses";
import OperationChecklist from "./dialogs/checklist";
import WasabeeMe from "./me";
import WasabeeOp from "./operation";
import { openDB } from "idb";
const Wasabee = window.plugin.wasabee;

window.plugin.wasabee.init = async () => {
  if (Wasabee._inited) return;
  Wasabee._inited = true;
  Object.freeze(Wasabee.static);

  if (
    window.iitcBuildDate == undefined ||
    window.iitcBuildDate < "2020-01-18-170317"
  ) {
    alert(
      "Wasabee won't work on this version of IITC; please <a href='https://iitc.app'>update to 0.30.1 or newer from https://iitc.app</a>. On desktop, <strong>do not use the IITC button</strong>, use the TamperMonkey/GreaseMonkey method."
    );
    return;
  }

  await initIdb();
  Wasabee._selectedOp = null; // the in-memory working op;
  Wasabee._updateList = new Map();
  Wasabee.portalDetailQueue = new Array();

  initSkin();
  // can this be moved to the auth dialog?
  initGoogleAPI();
  await setupLocalStorage();
  await initSelectedOperation();
  initServer();

  const skins = [];
  const ss = localStorage[Wasabee.static.constants.SKIN_KEY];
  try {
    const l = JSON.parse(ss);
    for (const s of l) skins.push(s);
  } catch {
    skins.push(ss);
  }
  if (skins.length > 0) {
    if (window.iitcLoaded) changeSkin(skins);
    else {
      window.addHook("iitcLoaded", () => {
        changeSkin(skins);
      });
    }
  }

  Wasabee.portalLayerGroup = new L.LayerGroup();
  Wasabee.linkLayerGroup = new L.LayerGroup();
  Wasabee.markerLayerGroup = new L.LayerGroup();
  Wasabee.agentLayerGroup = new L.LayerGroup();
  window.addLayerGroup("Wasabee Draw Portals", Wasabee.portalLayerGroup, true);
  window.addLayerGroup("Wasabee Draw Links", Wasabee.linkLayerGroup, true);
  window.addLayerGroup("Wasabee Draw Markers", Wasabee.markerLayerGroup, true);
  window.addLayerGroup("Wasabee Agents", Wasabee.agentLayerGroup, true);

  Wasabee.backgroundOpsGroup = new L.LayerGroup();
  window.addLayerGroup(
    "Wasabee Background Ops",
    Wasabee.backgroundOpsGroup,
    true
  );

  // standard hook, add our call to it
  window.addHook("mapDataRefreshStart", () => {
    window.map.fire("wasabee:uiupdate:agentlocations");
  });

  window.addHook("portalDetailsUpdated", (e) => {
    listenForPortalDetails({
      success: true,
      guid: e.guid,
      details: e.portalDetails,
    });
  });

  // XXX until we can make the necessary changes, fire all three
  window.map.on("wasabee:uiupdate", (d) => {
    console.trace();
    console.log("old uiupdate called -- redrawing everything");
    window.map.fire("wasabee:uiupdate:buttons");
    window.map.fire("wasabee:uiupdate:agentlocations");
    window.map.fire("wasabee:uiupdate:mapdata", d);
  });

  window.map.on("wasabee:op:change", drawMap);
  window.map.on("wasabee:op:select", drawMap);
  window.map.on("wasabee:uiupdate:agentlocations", drawAgents);

  // when the UI is woken from sleep on many devices
  window.addResumeFunction(() => {
    window.map.fire("wasabee:uiupdate:buttons");
    window.map.fire("wasabee:uiupdate:mapdata", { reason: "resume" }, false);
    window.map.fire("wasabee:uiupdate:agentlocations");
    sendLocation();
  });

  window.map.on("wasabee:op:select", () => {
    drawBackgroundOps();
  });
  window.map.on("wasabee:op:background", (data) => {
    if (data.background) {
      if (Wasabee._selectedOp && Wasabee._selectedOp.ID !== data.opID)
        WasabeeOp.load(data.opID).then(drawBackgroundOp);
    } else {
      drawBackgroundOps();
    }
  });

  window.map.on("wasabee:ui:buttonreset", addButtons);

  // Android panes
  const usePanes = localStorage[Wasabee.static.constants.USE_PANES] === "true";
  if (window.isSmartphone() && usePanes) {
    /* eslint-disable no-new */
    new WPane({
      paneId: "wasabee",
      paneName: "Wasabee",
      default: () => new OperationChecklist(),
    });
  }

  // hooks called when layers are enabled/disabled
  window.map.on("layeradd", (obj) => {
    if (
      obj.layer === Wasabee.portalLayerGroup ||
      obj.layer === Wasabee.linkLayerGroup ||
      obj.layer === Wasabee.markerLayerGroup
    ) {
      drawMap();
    }
    if (obj.layer === Wasabee.backgroundOpsGroup) {
      drawBackgroundOps();
    }
  });

  window.map.on("layerremove", (obj) => {
    if (
      obj.layer === Wasabee.portalLayerGroup ||
      obj.layer === Wasabee.linkLayerGroup ||
      obj.layer === Wasabee.markerLayerGroup
    ) {
      obj.layer.clearLayers();
    }
  });

  // late stage initializations
  initFirebase();
  initCrossLinks();
  initWasabeeD();

  // probably redundant now
  const sl = localStorage[Wasabee.static.constants.SEND_LOCATION_KEY];
  if (sl !== "true") {
    localStorage[Wasabee.static.constants.SEND_LOCATION_KEY] = "false";
  }

  // setup UI elements
  window.map.fire("wasabee:ui:buttonreset");
  setupToolbox();

  window.map.on("wasabee:ui:lang wasabee:ui:skin", addButtons);

  // draw the UI with the op data for the first time -- buttons are fresh, no need to update
  //window.map.fire("wasabee:uiupdate:mapdata", { reason: "startup" }, false);
  window.map.fire("wasabee:uiupdate:agentlocations");

  // run crosslinks
  window.map.fire("wasabee:crosslinks");

  // draw background ops
  drawBackgroundOps();

  // if the browser was restarted and the cookie nuked, but localstorge[me]
  // has not yet expired, we would think we were logged in when really not
  // this forces an update on reload
  if (WasabeeMe.isLoggedIn()) {
    WasabeeMe.waitGet(true);

    // load Wasabee-Defense keys if logged in
    window.map.fire("wasabee:defensivekeys", { reason: "startup" }, false);
  }

  window.map.on("wdialog", (dialog) => {
    postToFirebase({ id: "analytics", action: dialog.constructor.TYPE });
  });
};

// this can be moved to auth dialog, no need to init it for people who never log in
// and use webpack, rather than importing it ourself
function initGoogleAPI() {
  if (typeof window.gapi !== "undefined") {
    alert(
      "Wasabee detected another GAPI instance; there may be authentication issues"
    );
    window.gapi.load("auth2", () => {
      window.gapi.auth2.enableDebugLogs(false);
      console.log("loading GAPI auth2");
    });
    return;
  }
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.async = true;
  script.defer = true;
  script.src = "https://apis.google.com/js/platform.js";
  script.onload = () => {
    window.gapi.load("auth2", () => {
      window.gapi.auth2.enableDebugLogs(false);
    });
  };
  (document.body || document.head || document.documentElement).appendChild(
    script
  );
}

async function initIdb() {
  const version = 2;

  // XXX audit these to make sure all the various indexes are used
  Wasabee.idb = await openDB("wasabee", version, {
    upgrade(db, oldVersion, newVersion, tx) {
      if (oldVersion < 1) {
        const agents = db.createObjectStore("agents", { keyPath: "id" });
        agents.createIndex("date", "date"); // last location change
        agents.createIndex("fetched", "fetched"); // last pull from server
        const teams = db.createObjectStore("teams", { keyPath: "id" });
        teams.createIndex("fetched", "fetched"); // last pull from server

        // do not set an implied key, explicitly set GID/PortalID on insert
        // XXX we can do this with a keyPath https://stackoverflow.com/questions/33852508/how-to-create-an-indexeddb-composite-key
        // const defensivekeys = db.createObjectStore("defensivekeys");
        const defensivekeys = db.createObjectStore("defensivekeys", {
          keyPath: ["GID", "PortalID"],
        });
        defensivekeys.createIndex("PortalID", "PortalID");
        defensivekeys.createIndex("Count", "Count"); // To be used to remove 0-count entries
        // defensivekeys.createIndex("pk", ["GID", "PortalID"], { unique: true });
      }
      if (oldVersion < 2) {
        const ops = db.createObjectStore("operations", { keyPath: "ID" });
        ops.createIndex("fetched", "fetched");
        ops.createIndex("server", "server");
      }
      /* if (oldVersion < 3) {
        const teams = tx.objectStore("teams");
        teams.createIndex("_agents", "_agents[].id");
      } */
      console.debug(newVersion, tx);
    },
  });
}
