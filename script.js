const saved = document.getElementById("saved");
let declare = "";
const minifyButton = document.getElementById("minify-button");
const minifyInput = document.getElementById("minify-input");
const minifyOutput = document.getElementById("minify-output");
function byteCount(s) {
  return encodeURI(s).split(/%..|./).length - 1;
}
const minify = (code) => {
  // Get position of all #define
  const precodeSize = byteCount(code);
  const definePos = [];
  let pos = code.indexOf("#");
  while (pos !== -1) {
    definePos.push(pos);
    pos = code.indexOf("#", pos + 1);
  }
  // Get position of all #include

  let define = [];
  for (let i = 0; i < definePos.length; i++) {
    let j = definePos[i];
    while (code[j] !== "\n") {
      j++;
    }
    define.push(j);
  }
  let definePart = "";
  if (define.length > 0) definePart = code.slice(0, define[define.length - 1]);
  const codePart = code
    .slice(define[define.length - 1], code.length)
    .replaceAll("\t", "")
    .replaceAll('"\n"', "C_MINIFY_PROCESSTEMPO")
    .replaceAll("\n", "")
    .replaceAll("C_MINIFY_PROCESSTEMPO", '"\n"');

  // Merge definePart and codePart
  code = (definePart.length > 0 ? definePart + "\n" : "") + codePart;
  declare = code;
  const postCodeSize = byteCount(code);
  const percentage = ((precodeSize - postCodeSize) / precodeSize) * 100;
  saved.innerHTML = `${percentage.toFixed(2)}%`;
  console.log(definePart, codePart);
  return code;
};

minifyButton.addEventListener("click", () => {
  const input = minifyInput.value;
  const output = minify(input);
  minifyOutput.value = output;
});

const minifyCopy = document.getElementById("minify-copy");
minifyCopy.addEventListener("click", () => {
  minifyOutput.select();
  // Get length of minifyOutput
  let minifyOutputLength = minifyOutput.value.length;
  minifyOutput.setSelectionRange(0, minifyOutputLength);
  document.execCommand("copy");
  minifyOutput.setSelectionRange(minifyOutputLength, minifyOutputLength);
  minifyCopy.innerHTML = "Copied!";
  minifyCopy.classList = "btn btn-success";
  setTimeout(() => {
    minifyCopy.classList = "btn btn-warning";
    minifyCopy.innerHTML = "Copy";
  }, 1000);
});
