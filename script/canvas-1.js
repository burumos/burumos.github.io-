// https://www.tam-tam.co.jp/tipsnote/javascript/post13538.html
// https://konvajs.org/docs/sandbox/Multi-touch_Scale_Shape.html
// https://konvajs.org/docs/drag_and_drop/Drag_an_Image.html

const canvasWidth = window.innerWidth;
const canvasHeight = 800;
let stage = null;

const windowLoadPromise = loadPromise(window);
windowLoadPromise.then(() => {
    stage = new Konva.Stage({
        container: 'container',
        width: canvasWidth,
        height: canvasHeight
    });

    // fileを選択して描画
    const file_btn = document.getElementById('file-btn');
    // file_btn.addEventListener('change', (event) => {
    changePromise(file_btn).then((event) => {
          // ファイル情報を取得
        const fileData = event.target.files[0];
        // 画像ファイル以外は処理を止める
        if(!fileData.type.match('image.*')) {
            alert('画像を選択してください');
            return;
        }
        // FileReaderオブジェクトを使ってファイル読み込み
        const reader = new FileReader();
        let selectedImageObj = new Image();
        loadPromise(reader).then(() => {
            const promise = loadPromise(selectedImageObj);
            selectedImageObj.src = reader.result;
            return promise;
        }).then(() => {
            drawImage(selectedImageObj, stage, {
                draggable: true,
            });
        });
        // ファイル読み込みを実行
        reader.readAsDataURL(fileData);
    });
});

// 飛行機を描画
const initImageObj = new Image();
Promise.all([windowLoadPromise, loadPromise(initImageObj)]).then(() => {
    drawImage(initImageObj, stage, {draggable: true});
});
initImageObj.src = 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png';

function eventPromise(obj, eventName) {
    return new Promise(resolve => {
        return obj.addEventListener(eventName, (e) => {
            resolve(e);
        });
    });
}
function loadPromise(obj) {return eventPromise(obj, 'load');}
function changePromise(obj) {return eventPromise(obj, 'change');}

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

function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

