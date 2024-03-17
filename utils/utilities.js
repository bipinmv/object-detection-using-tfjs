export const renderPrediction = (predictions, context) => {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  // text styling and positioning
  const font = '14px sans-serif';
  context.font = font;
  context.textBaseline = 'top';

  predictions.forEach(prediction => {
    const [x, y, width, height] = prediction["bbox"];
    const isPerson = prediction.class === "person";

    // bounding box
    context.strokeStyle = isPerson ? "#FF0000" : "#00FFFF";
    context.lineWidth = 4;
    context.strokeRect(x, y, width, height);

    // fill color
    context.fillStyle = `rgba(255, 0, 0, ${isPerson ? 0.1 : 0})`;
    context.fillRect(x, y, width, height);

    // draw background text
    context.fillStyle = isPerson ? "#FF0000" : "#00FFFF";
    const textWidth = context.measureText(prediction.class).width;
    const textHeight = parseInt(font, 10); // base 10
    context.fillRect(x, y, textWidth + 4, textHeight + 4);

    context.fillStyle = "#000000";
    context.fillText(prediction.class, x, y);
  });
}