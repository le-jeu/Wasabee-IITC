import bundle from "./bundle";

var script = document.createElement("script");
script.appendChild(document.createTextNode(bundle));
(document.body || document.head || document.documentElement).appendChild(
  script
);