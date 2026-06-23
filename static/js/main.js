// Project entry point (loaded from base.html). We expose a function that opens
// a fully custom Office.js dialog -- the same mechanism book.app.alert() uses,
// but with our own route, template and message protocol.
//
// config.js (loaded before main.js) sets globalThis.config but does NOT export
// a `config` binding, so we read it off globalThis rather than importing it.

let dialog;

function processMessage(arg) {
  if (dialog) {
    dialog.close();
    dialog = undefined;
  }
  let data;
  try {
    data = JSON.parse(arg.message);
  } catch {
    data = { raw: arg.message };
  }
  // No auth logic yet -- just show what came back.
  console.log("Custom dialog returned:", data);
}

function processDialogEvent(arg) {
  // 12006 = dialog closed by the user (X button); others are load errors.
  if (arg.error !== 12006) {
    console.log(`Custom dialog event error: ${arg.error}`);
  }
  dialog = undefined;
}

function dialogCallback(asyncResult) {
  if (asyncResult.status === Office.AsyncResultStatus.Failed) {
    console.log(`${asyncResult.error.message} [${asyncResult.error.code}]`);
    return;
  }
  dialog = asyncResult.value;
  dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
  dialog.addEventHandler(Office.EventType.DialogEventReceived, processDialogEvent);
}

async function openCustomDialog() {
  await Office.onReady();
  if (dialog) {
    // Avoid error 12007 (a dialog is already open).
    dialog.close();
  }
  // displayInIframe: false gives a standalone window, which is what you want
  // for an external login page later on (an iframe can't host most OAuth pages).
  Office.context.ui.displayDialogAsync(
    window.location.origin + (globalThis.config?.appPath ?? "") + "/custom-dialog",
    { height: 40, width: 30, displayInIframe: false },
    dialogCallback,
  );
}

// Wire up the taskpane button. main.js loads as a module in <head>, so the DOM
// may not be ready yet -- guard with DOMContentLoaded.
function init() {
  const btn = document.getElementById("btn-custom-dialog");
  if (btn) {
    btn.addEventListener("click", openCustomDialog);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
