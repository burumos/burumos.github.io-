// https://www.tam-tam.co.jp/tipsnote/javascript/post13538.html
// https://konvajs.org/docs/sandbox/Multi-touch_Scale_Shape.html
// https://konvajs.org/docs/drag_and_drop/Drag_an_Image.html

const canvasWidth = window.innerWidth;
const canvasHeight = 800;

window.addEventListener('load', () => {
    const stage = new Konva.Stage({
        container: 'container',
        width: canvasWidth,
        height: canvasHeight
    });

    let imageObj = new Image();
    let onloadImageLayer = null;
    imageObj.onload = () => {
        onloadImageLayer = drawImage(imageObj, stage, {draggable: true});
    };
    imageObj.src = 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png';

    // fileを選んで読み込み
    const file_btn = document.getElementById('file-btn');
    file_btn.addEventListener('change', (event) => {
          // ファイル情報を取得
        const fileData = event.target.files[0];
        // 画像ファイル以外は処理を止める
        if(!fileData.type.match('image.*')) {
            alert('画像を選択してください');
            return;
        }
        // FileReaderオブジェクトを使ってファイル読み込み
        const reader = new FileReader();
        // ファイル読み込みに成功したときの処理
        reader.onload = function() {
            let selectedImageObj = new Image();
            selectedImageObj.onload = () => {
                drawImage(selectedImageObj, stage, {
                    draggable: true,
                });
            };
            selectedImageObj.src = reader.result;
        };
        // ファイル読み込みを実行
        reader.readAsDataURL(fileData);
    });
});


// イメージオブジェクトを基に描画
function drawImage(imageObj, stage, option={}, layer=null) {
    if (!layer) layer = new Konva.Layer();
    option = {
        image: imageObj,
        x: option.x || 50,
        y: option.y || 50,
        width: option.width || imageObj.width,
        height: option.height || imageObj.height,
        draggable: option.draggable || false,
    };

    const image = new Konva.Image(option);

    layer.add(image);
    stage.add(layer);
    return layer;
}

