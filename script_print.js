let video;
let charSize = 10;
let patternVariant = 0;
let asciiChars = " .:-=+*#%@";
let patternColor = [255, 255, 255]; // Colore iniziale bianco
let outlineColor = [255, 255, 255]; // Colore del bordo iniziale bianco
let desiredWidth = 1654; // Larghezza desiderata del video
let desiredHeight = 1076; // Altezza desiderata del video
let colorPicker, outlineColorPicker, patternSlider;
let originalLabelText = "CARICA UN VIDEO"; // Testo originale del label

let patternDrawn = false; // Flag per indicare se i pattern sono stati disegnati

function setup() {
  // Creazione del canvas e assegnazione al div con ID "videoContainer"
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('videoContainer');

  // Imposta un frame rate più basso
  frameRate(30);

  // Creazione del selettore di colore principale
  colorMode(RGB);
  colorPicker = select('#colorPicker');
  colorPicker.value('#FF00FF'); // Imposta il colore iniziale a magenta nel selettore
  colorPicker.input(changePatternColor);

  // Creazione del selettore di colore per il bordo
  outlineColorPicker = select('#outlineColorPicker');
  outlineColorPicker.value('#FF2600'); // Imposta il colore iniziale a bianco nel selettore del bordo
  outlineColorPicker.input(changeOutlineColor);

  // Imposta il colore iniziale del pattern
  changePatternColor();
  changeOutlineColor();

  // Creazione dello slider per gestire le caratteristiche dei pattern
  patternSlider = select('#patternSlider');

  // Aggiungi un evento change al file input
  document.getElementById('videoUpload').addEventListener('change', handleFile, false);

  // Aggiungi un evento click al bottone "PATTERN"
  let patternButton = document.getElementById('patternButton');
  patternButton.addEventListener('click', changePattern);

  // Aggiungi eventi mouseover e mouseout al label del file input
  let videoUploadLabel = document.getElementById('videoUploadLabel');
  videoUploadLabel.addEventListener('mouseover', showChooseFileText);
  videoUploadLabel.addEventListener('mouseout', resetLabelText);

  // Aggiungi un evento resize per il canvas
  window.addEventListener('resize', resizeCanvasToWindow);
}

function draw() {
  background(0);

  if (video && video.time() > 0) {
    video.loadPixels();

    if (video.pixels.length > 0) { // Verifica che i pixel siano stati caricati
      let w = video.width;
      let h = video.height;
      let scaleFactor = charSize;

      for (let y = 0; y < h; y += scaleFactor) {
        for (let x = 0; x < w; x += scaleFactor) {
          let index = (x + y * w) * 4;
          let brightness = (video.pixels[index] + video.pixels[index + 1] + video.pixels[index + 2]) / 3;
          selectPattern(x, y, scaleFactor, brightness);
        }
      }
      patternDrawn = true;
    }
  } else {
    simulatePatternDrawing();
    patternDrawn = true;
  }
}

function simulatePatternDrawing() {
  let scaleFactor = charSize;
  let simulatedBrightness = 127; // Valore di luminosità simulato

  for (let y = 0; y < windowHeight; y += scaleFactor) {
    for (let x = 0; x < windowWidth; x += scaleFactor) {
      selectPattern(x, y, scaleFactor, simulatedBrightness);
    }
  }
}

function selectPattern(x, y, scaleFactor, brightness) {
  switch (patternVariant) {
    case 0:
      let minLineWidth = 1;
      let maxLineWidth = 2;
      let lineWidth = map(brightness, 0, 255, minLineWidth, maxLineWidth);
      stroke(patternColor);
      strokeWeight(lineWidth);
      if (brightness > patternSlider.value()) {
        stroke(outlineColor[0], outlineColor[1], outlineColor[2]);
        line(x, y, x + scaleFactor, y + scaleFactor);
      } else {
        line(x + scaleFactor, y, x, y + scaleFactor);
      }
      break;

    case 1:
      let diameter = map(brightness, 0, 255, scaleFactor, scaleFactor * 5);
      let centerX = x + scaleFactor / 2;
      let centerY = y + scaleFactor / 2;
      noFill();
      stroke(patternColor);
      if (brightness > patternSlider.value()) {
        stroke(outlineColor[0], outlineColor[1], outlineColor[2]);
        ellipse(centerX, centerY, diameter, diameter);
      } else {
        ellipse(centerX, centerY, diameter / 2, diameter / 2);
      }
      break;

    case 2:
      let rectSize = map(brightness, 0, 255, scaleFactor / 2, scaleFactor * 2);
      if (brightness > patternSlider.value()) {
        fill(outlineColor[0], outlineColor[1], outlineColor[2]);
        stroke(patternColor[0], patternColor[1], patternColor[2]);
      } else {
        noFill();
      }
      rect(x, y, rectSize, rectSize);
      break;

    case 3:
      let asciiIndex = floor(map(brightness, 0, 255, 0, asciiChars.length));
      let asciiChar = asciiChars.charAt(asciiIndex);
      let charCount = map(patternSlider.value(), 0, 230, 1, 2.5);
      textSize(charSize * charCount);
      textFont('monospace');
      if (brightness > patternSlider.value()) {
        fill(outlineColor[0], outlineColor[1], outlineColor[2]);
        stroke(patternColor[0], patternColor[1], patternColor[2]);
      } else {
        noFill();
      }
      text(asciiChar.repeat(charCount), x, y);
      break;

    case 4:
      let minLineWidthPattern2 = 15;
      let maxLineWidthPattern2 = 25;
      let lineWidthPattern2 = map(brightness, 0, 255, minLineWidthPattern2, maxLineWidthPattern2);
      stroke(patternColor);
      strokeWeight(lineWidthPattern2);
      if (brightness > patternSlider.value()) {
        stroke(outlineColor[0], outlineColor[1], outlineColor[2]);
        line(x, y, x + scaleFactor, y + scaleFactor);
      } else {
        line(x + scaleFactor, y, x, y);
      }
      break;

    default:
      let defaultMinLineWidth = 1;
      let defaultMaxLineWidth = 2;
      let defaultLineWidth = map(brightness, 0, 255, defaultMinLineWidth, defaultMaxLineWidth);
      stroke(patternColor);
      strokeWeight(defaultLineWidth);
      if (brightness > patternSlider.value()) {
        stroke(outlineColor[0], outlineColor[1], outlineColor[2]);
        line(x, y, x + scaleFactor, y + scaleFactor);
      } else {
        line(x + scaleFactor, y, x, y);
      }
      break;
  }
}

function changePatternColor() {
  let hexColor = colorPicker.value();
  patternColor = hexToRGB(hexColor);
}

function changeOutlineColor() {
  let hexColor = outlineColorPicker.value();
  outlineColor = hexToRGB(hexColor);
}

function hexToRGB(hex) {
  let bigint = parseInt(hex.slice(1), 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;
  return [r, g, b];
}

function changePattern() {
  patternVariant = (patternVariant + 1) % 5;
  resetDrawing();
}

function resetDrawing() {
  strokeWeight(1);
  fill(255);
}

function handleFile(event) {
  stopPreviousVideo();

  let file = event.target.files[0];
  if (file.type === 'video/mp4') {
    let videoURL = URL.createObjectURL(file);
    video = createVideo(videoURL, videoLoaded);
    video.size(desiredWidth, desiredHeight);
    video.style('display', 'none');
    video.parent('videoContainer');
    updateLabel(file.name);
  } else {
    alert('Caricare un file video MP4 valido.');
  }
}

function stopPreviousVideo() {
  if (video) {
    video.stop();
    video.remove();
    video = null;
  }
}

function videoLoaded() {
  video.loop();
  video.hide();
}

function resizeCanvasToWindow() {
  resizeCanvas(windowWidth, windowHeight);
}

function updateLabel(fileName) {
  let label = document.getElementById('videoUploadLabel');
  label.textContent = fileName;
  originalLabelText = fileName;
}

function showChooseFileText() {
  let label = document.getElementById('videoUploadLabel');
  label.textContent = "CARICA UN VIDEO";
}

function resetLabelText() {
  let label = document.getElementById('videoUploadLabel');
  label.textContent = originalLabelText;
}
