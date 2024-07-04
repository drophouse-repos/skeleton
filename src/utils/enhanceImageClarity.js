export function enhanceImageClarity(base64Image) {
    return new Promise((resolve, reject) => {
      // Create a new Image object
      const imageElement = new Image();
      
      // Set up the onload callback
      imageElement.onload = () => {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        // Set the canvas dimensions to match the image
        canvas.width = imageElement.width;
        canvas.height = imageElement.height;
  
        // Draw the image onto the canvas
        ctx.drawImage(imageElement, 0, 0);
  
        // Get the image data from the canvas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
  
        // Apply a simple sharpening filter
        const w = canvas.width;
        const h = canvas.height;
        const weights = [0, -1, 0, -1, 5, -1, 0, -1, 0];
        const side = Math.round(Math.sqrt(weights.length));
        const halfSide = Math.floor(side / 2);
        const output = ctx.createImageData(w, h);
        const dst = output.data;
  
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const sy = y;
            const sx = x;
            const dstOff = (y * w + x) * 4;
            let r = 0, g = 0, b = 0;
            for (let cy = 0; cy < side; cy++) {
              for (let cx = 0; cx < side; cx++) {
                const scy = sy + cy - halfSide;
                const scx = sx + cx - halfSide;
                if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
                  const srcOff = (scy * w + scx) * 4;
                  const wt = weights[cy * side + cx];
                  r += data[srcOff] * wt;
                  g += data[srcOff + 1] * wt;
                  b += data[srcOff + 2] * wt;
                }
              }
            }
            dst[dstOff] = r;
            dst[dstOff + 1] = g;
            dst[dstOff + 2] = b;
            dst[dstOff + 3] = data[dstOff + 3];
          }
        }
  
        // Put the enhanced image data back to the canvas
        ctx.putImageData(output, 0, 0);
  
        // Resolve the promise with the enhanced image in base64 format
        resolve(canvas.toDataURL('image/jpeg'));
      };
  
      // Set up the onerror callback
      imageElement.onerror = (error) => reject(error);
  
      // Set the source of the image to the base64 string
      imageElement.src = base64Image;
    });
  }
  