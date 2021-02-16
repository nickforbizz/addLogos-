const Jimp = require("jimp");
var fs = require('fs');
const cliProgress = require('cli-progress');
 
var total_files = 0;
var file_count = 0;
// create a new progress bar instance and use shades_classic theme
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const processImg = (img, logo) => {
  const ORIGINAL_IMAGE = img;
  const ORIGINAL_IMAGE_name = ORIGINAL_IMAGE.replace('./images/', '');
  const LOGO = logo;
  
  const LOGO_MARGIN_PERCENTAGE = 5;
  
  const FILENAME = ORIGINAL_IMAGE_name;
  
  const main = async () => {
    const [image, logo] = await Promise.all([
      Jimp.read(ORIGINAL_IMAGE),
      Jimp.read(LOGO)
    ]);

  
    logo.resize(image.bitmap.width / 4, Jimp.AUTO);
  
    const xMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
    const yMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
  
    
    const X = image.bitmap.width - logo.bitmap.width - xMargin;
    const Y = image.bitmap.height - logo.bitmap.height - yMargin;
  
    return image.composite(logo, X, Y, [
      {
        mode: Jimp.BLEND_SCREEN,
        opacitySource: 0.1, 
        opacityDest: 1
      }
    ]);
  };
  
  main().then(image => {
    image.write('./processed_images/'+FILENAME);
    // update the current value in your application..
    file_count++;
    bar1.update(file_count);
    if (file_count == total_files) {
      // stop the progress bar
      bar1.stop();
    }

  });

}


// processImg( "./images/blog_grid_02.jpg", "./logo/logo.png");

let run=()=>{

console.log("Initializing image processor ....")
console.log("===========================");

  var files = fs.readdirSync('./images/');
  total_files = files.length;
  
  console.log(`processing ${total_files} images \n`);
  bar1.start(total_files, 0);


  files.map(file=> processImg( `./images/${file}`, "./logo/logo.png") )

}

run()

