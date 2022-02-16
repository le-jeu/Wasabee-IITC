function define(chunk) {
  var script = document.createElement("script");
  script.appendChild(document.createTextNode("(" + chunk + ")()"));
  (document.body || document.head || document.documentElement).appendChild(
    script
  );
}