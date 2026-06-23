// Runs INSIDE the Office.js dialog window (loaded by custom_dialog.html).
// When a button is clicked, it sends the button id back to the task pane via
// messageParent() and lets the parent close the dialog.
//
// The message must stay same-origin: only pages served from the add-in's own
// origin can call messageParent(). For a real third-party OAuth flow you'd
// redirect out to the provider and back to a same-origin page, and call
// messageParent() from there.

Office.onReady(() => {
  for (const id of ["ok", "cancel"]) {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", () => {
        Office.context.ui.messageParent(JSON.stringify({ button: id }));
      });
    }
  }
});
