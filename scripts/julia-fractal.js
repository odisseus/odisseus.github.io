
/**
 * This code is based on the following sources:
 * http://rembound.com/articles/drawing-mandelbrot-fractals-with-html5-canvas-and-javascript
 * https://filosophy.org/code/using-html5-canvas-to-make-a-generative-background/
 * https://www.cs.unm.edu/~stharding/julia/julia.html
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
 */

// The function gets called when the window is fully loaded
window.onload = function() {
    // Get the canvas and context
    var canvas = document.createElement('canvas');
    var context = canvas.getContext("2d");
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;

    var bufferCanvas = document.createElement('canvas');
    bufferCanvas.width = canvas.width;
    bufferCanvas.height = canvas.height;
    var bufferContext = bufferCanvas.getContext("2d");

    // Width and height of the image
    var imagew = canvas.width;
    var imageh = canvas.height;

    // Image Data (RGBA)
    var imagedata = context.createImageData(imagew, imageh);

    // Pan and zoom parameters
    var offsetx = -imagew / 2;
    var offsety = -imageh / 2;
    var panx = -100;
    var pany = 0;
    var zoom = imageh;

    // Palette array of 256 colors
    var palette = [];

    // Color for the points that belong to the set
    var insideColor = { r: 0, g: 0, b: 0 };

    // The maximum number of iterations per pixel
    var maxiterations = 250;

    var revealSteps = 4;
    var currentStep = 0;

    // Initialize the game
    function init() {

        // Generate palette
        generatePalette();

        // Generate image
        generateImage();

        // Draw the generated image
        bufferContext.putImageData(imagedata, 0, 0);

        // Enter main loop
        main(0);
    }

    // Main loop
    function main(tframe) {
        var middle = Math.floor(imageh / 2);
        var rate = Math.floor(middle / revealSteps);

        // Reveal part of the pre-generated image
        var x = 0;
        var y = rate * currentStep;
        var w = imagew;
        var h = rate;
        context.drawImage(bufferCanvas, x, middle - y - 1, w, h, x, middle - y - 1, w, h);
        context.drawImage(bufferCanvas, x, middle + y, w, h, x, middle + y, w, h);

        document.body.style.background = "url(" + canvas.toDataURL() + ")";
        document.body.style.backgroundSize = "cover";

        // Request animation frames
        if (currentStep <= revealSteps) {
            currentStep = currentStep + 1;
            window.requestAnimationFrame(main);
        }

    }

    // Generate palette
    function generatePalette() {
        // Calculate a gradient
        var roffset = 256;
        var goffset = 256;
        var boffset = 256;
        for (var i = 0; i < 256; i++) {
            palette[i] = { r: roffset, g: goffset, b: boffset };
            if (i < 64) {
                roffset -= 3;
            } else if (i < 128) {
                goffset -= 3;
            } else if (i < 192) {
                boffset -= 3;
            }
        }
    }

    // Generate the fractal image
    function generateImage() {
        // Iterate over the pixels
        for (var y = 0; y < imageh; y++) {
            for (var x = 0; x < imagew; x++) {
                iterate(x, y, maxiterations);
            }
        }
    }

    // Calculate the color of a specific pixel
    function iterate(x, y, maxiterations) {
        // Convert the screen coordinate to a fractal coordinate
        var x0 = (x + offsetx + panx) / zoom;
        var y0 = (y + offsety + pany) / zoom;

        // Iteration variables
        var a = x0;
        var b = y0;
        var rx = a;
        var ry = b;

        // Constants for the Julia set iteration
        var cx = 0.27;
        var cy = 0.49;

        // Iterate
        var iterations = 0;
        while (iterations < maxiterations && (rx * rx + ry * ry <= 4)) {
            rx = a * a - b * b + cx;
            ry = 2 * a * b + cy;

            // Next iteration
            a = rx;
            b = ry;
            iterations++;
        }

        // Get palette color based on the number of iterations
        var color;
        if (iterations == maxiterations) {
            color = insideColor;
        } else {
            var index = Math.floor((iterations / (maxiterations - 1)) * 255);
            color = palette[index];
        }

        // Apply the color
        var pixelindex = (y * imagew + x) * 4;
        imagedata.data[pixelindex] = color.r;
        imagedata.data[pixelindex + 1] = color.g;
        imagedata.data[pixelindex + 2] = color.b;
        imagedata.data[pixelindex + 3] = 255;
    }

    // Call init to start the game
    init();
};