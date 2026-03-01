
   // pop up messages
function initExternalLinks() {
  document.querySelectorAll(".external-link").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const url = this.getAttribute("data-url") || this.href;

      if (confirm("You are about to open an external website. Continue?")) {
        if (window.cordova && cordova.InAppBrowser) {
          cordova.InAppBrowser.open(url, "_system"); // opens native browser
        } else {
          window.open(url, "_blank"); // fallback sa browser
        }
      }
    });
  });
}

function openGmail() {
    const mailtoLink = "mailto:dccarlobos@gmail.com?subject=Feedback on RME Reviewer";
    if (window.cordova && cordova.InAppBrowser) {
        cordova.InAppBrowser.open(mailtoLink, "_system");
    } else {
        window.location.href = mailtoLink;
    }
}