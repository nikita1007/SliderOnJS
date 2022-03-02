const { src, dest, series, watch } = require("gulp");
const sync = require("browser-sync").create();

function serverStart() {
  sync.init({
    server: "./",
  });

  watch("./**/**").on("change", sync.reload);
}

exports.serve = series(serverStart);