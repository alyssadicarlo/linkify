'use strict';

function toggleDarkMode() {
  halfmoon.toggleDarkMode();
}

// Make sure that the cookie exists
if (halfmoon.readCookie("halfmoon_preferredMode")) {
  if (halfmoon.readCookie("halfmoon_preferredMode") == "light-mode") {
    // Light mode is preferred
  }
  else if (halfmoon.readCookie("halfmoon_preferredMode") == "dark-mode") {
    // Dark mode is preferred
  }
};
