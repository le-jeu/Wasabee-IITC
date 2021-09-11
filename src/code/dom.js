export function createElement(tagName, attrs = {}, ...children) {
  if (tagName === "fragment") return children;
  attrs = attrs || {};
  const rawHtml = attrs.rawHtml;
  delete attrs.rawHtml;
  const elem = Object.assign(document.createElement(tagName), attrs);
  if (rawHtml) {
    elem.innerHTML = rawHtml;
    return elem;
  }
  for (const child of children) {
    if (Array.isArray(child)) elem.append(...child);
    else elem.append(child);
  }
  return elem;
}
