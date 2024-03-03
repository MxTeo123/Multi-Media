class ImageEditor {
  #Canvas;
  #CanvasContext;
  #effect;

  constructor(Canvas) {
    this.#Canvas = Canvas;
    this.#CanvasContext = this.#Canvas.getContext("2d");
  }

  saveImage() {
    const dataUrl = this.#Canvas.toDataURL("image/png", 1);
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "Image.png";
    a.click();
  }

  changeImage(image) {
    this.#Canvas.width = image.naturalWidth;
    this.#Canvas.height = image.naturalHeight;

    this.#CanvasContext.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );

    this.#effect = "normal";
    this.#drawImage();
  }

  #drawImage() {
    switch (this.#effect) {
      case "normal":
        this.#normal();
        break;
      default:
        throw new Error("Unknown effect: " + this.#effect);
    }
  }

  #normal() {
    this.#CanvasContext.drawImage(this.#Canvas, 0, 0);
  }

  addText(text, size, color, x, y) {
    this.#CanvasContext.font = size + "px Lemon";
    this.#CanvasContext.fillStyle = color;
    this.#CanvasContext.fillText(text, x, y);
  }

  resizeImage(newWidth, newHeight) {
    const originalWidth = this.#Canvas.width;
    const originalHeight = this.#Canvas.height;

    const tempCanvas = document.createElement("canvas");
    const tempContext = tempCanvas.getContext("2d");
    tempCanvas.width = originalWidth;
    tempCanvas.height = originalHeight;
    tempContext.drawImage(this.#Canvas, 0, 0);

    this.#Canvas.width = newWidth;
    this.#Canvas.height = newHeight;

    this.#CanvasContext.drawImage(
      tempCanvas,
      0,
      0,
      originalWidth,
      originalHeight,
      0,
      0,
      newWidth,
      newHeight
    );

    this.#effect = "normal";
  }

  drawHistogram() {
    const v = [];
    for (let i = 0; i < 256; i++) v.push(0);

    const imageData = this.#CanvasContext.getImageData(
      0,
      0,
      this.#Canvas.width,
      this.#Canvas.height
    );
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const avg = Math.round((r + g + b) / 3);
      v[avg]++;
    }

    barChart.draw(v, { stroke: false });
  }
}
class BarChart {
  #canvas;
  constructor(canvas) {
    this.#canvas = canvas;
  }
  draw(values, options) {
    const context = this.#canvas.getContext("2d");

    context.save();

    context.fillStyle = "#DEDEDE";
    context.fillRect(0, 0, this.#canvas.width, this.#canvas.height);

    context.fillStyle = "orange";
    context.strokeStyle = "black";
    context.lineWidth = 2;

    const maxValue = Math.max(...values);
    const f = this.#canvas.height / maxValue;

    const barWidth = this.#canvas.width / values.length;

    for (let i = 0; i < values.length; i++) {
      const barHeight = values[i] * f * 0.9;
      const barX = i * barWidth + barWidth / 4;
      const barY = this.#canvas.height - barHeight;

      context.fillRect(barX, barY, barWidth / 2, barHeight);

      if (options.stroke)
        context.strokeRect(barX, barY, barWidth / 2, barHeight);
    }
    context.restore();
  }
}
