// https://www.tam-tam.co.jp/tipsnote/javascript/post13538.html
// https://konvajs.org/docs/sandbox/Multi-touch_Scale_Shape.html
// https://konvajs.org/docs/drag_and_drop/Drag_an_Image.html

const file_btn = document.getElementById('file-btn');
const canvas = document.getElementById('canvas');
const canvasWidth = 500;
const canvasHeight = canvas.innerHeight;

// Canvasの準備
// var ctx = canvas.getContext('2d');

// function loadLocalImage(e) {
//   // ファイル情報を取得
//   const fileData = e.target.files[0];

//   // 画像ファイル以外は処理を止める
//   if(!fileData.type.match('image.*')) {
//     alert('画像を選択してください');
//     return;
//   }

//   // FileReaderオブジェクトを使ってファイル読み込み
//   const reader = new FileReader();
//   // ファイル読み込みに成功したときの処理
//   reader.onload = function() {
//     // Canvas上に表示する
//     uploadImgSrc = reader.result;
//     canvasDraw();
//   };
//   // ファイル読み込みを実行
//   reader.readAsDataURL(fileData);
// }

// ファイルが指定された時にloadLocalImage()を実行
// file_btn.addEventListener('change', loadLocalImage, false);

// Canvas上に画像を表示する
// function canvasDraw() {
//     // canvas内の要素をクリアする
//     // ctx.clearRect(0, 0, 100, 100);
//     // Canvas上に画像を表示
//     const img = new Image();
//     img.src = uploadImgSrc;
//     img.onload = function() {
//       ctx.drawImage(img, 0, 0, 30, 30);
//     };
// }

window.onload.addEventListener(() => {
    const stage = new Konva.Stage({
        container: 'container',
        width: canvasWidth,
        height: canvasHeight
    });

    let imageObj = new Image();
    imageObj.onload = () => {
        drawImage(imageObj, stage);
    };
    imageObj.src = 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png';
});


// イメージオブジェクトを基に描画
function drawImage(imageObj, stage, option={}, layer=null) {
    if (!layer) layer = new Konva.Layer();

    imageObj.onload = function() {
        const image = new Konva.Image({
            image: imageObj,
            x: option.x || 50,
            y: option.y || 50,
            width: option.width || imageObj.width,
            height: option.height || imageObj.height,
        });

        layer.add(image);
        stage.add(layer);
    };
    return layer;
}

