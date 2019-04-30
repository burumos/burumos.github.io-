// https://www.tam-tam.co.jp/tipsnote/javascript/post13538.html
// https://konvajs.org/docs/sandbox/Multi-touch_Scale_Shape.html
// https://konvajs.org/docs/drag_and_drop/Drag_an_Image.html

const canvasDom = document.getElementById('container');
const canvasWidth = canvasDom.clientWidth || window.innerWidth;
const canvasHeight = canvasDom.clientHeight || 800;
let stage = null;
let activeShape = null;
let lastDist = 0;
let touchPoints = 0;

const windowLoadPromise = loadPromise(window);
windowLoadPromise.then(() => {
    stage = new Konva.Stage({
        container: 'container',
        width: canvasWidth,
        height: canvasHeight,
        name: 'stage',
    });

    // fileを選択して描画
    const file_btn = document.getElementById('file-btn');
    file_btn.addEventListener('change', (event) => {
          // ファイル情報を取得
        const fileData = event.target.files[0];
        // 画像ファイル以外は処理を止める
        if(!fileData.type.match('image.*')) {
            alert('画像を選択してください');
            return;
        }
        drawImageByFile(fileData, {
            draggable: true,
            name: 'selectedImage' + getCount(),
        });
    });

    stage.on(
        'touchstart',
        e => {
            const shape = e.target;
            touchPoints++;
            if (touchPoints === 1) {
                activeShape = shape;
            }
            printLog('touchstart: ', shape.name());
        });

    stage.getContent().addEventListener(
        'touchmove',
        event => pinchInOut(event),
        false);

    stage.getContent().addEventListener(
        'touchend',
        () => {
            lastDist = 0;
            touchPoints--;
            if (touchPoints === 0) {
                activeShape = null;
            }
        });
});

// 飛行機を描画
const initImageObj = new Image();
Promise.all([windowLoadPromise, loadPromise(initImageObj)]).then(() => {
    drawImage(initImageObj, stage, {
        draggable: true,
        stroke: 'black',
        strokeWidth: 5,
        name: 'initImage',
    });
});
initImageObj.src = '/image/airplane.png';

// 画像を選択して描画
function drawImageByFile(file, option={}, layer=null) {
    // FileReaderオブジェクトを使ってファイル読み込み
    const reader = new FileReader();
    let selectedImageObj = new Image();
    loadPromise(reader).then(() => {
        const promise = loadPromise(selectedImageObj);
        selectedImageObj.src = reader.result;
        return promise;
    }).then(() => {
        drawImage(selectedImageObj, stage, option, layer);
    });
    // ファイル読み込みを実行
    reader.readAsDataURL(file);
}

// ピンチインorアウト
function pinchInOut (event) {
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];

    if (!(touch1 && touch2 && activeShape && activeShape.getName())) {
        return;
    }
    const layer = activeShape.getLayer();
    const dist = getDistance(
        {x: touch1.clientX,
         y: touch1.clientY},
        {x: touch2.clientX,
         y: touch2.clientY}
    );

    if (!lastDist) {
        lastDist = dist;
    }

    const scale = (activeShape.scaleX() * dist) / lastDist;
    activeShape.scaleX(scale);
    activeShape.scaleY(scale);
    if(layer) layer.batchDraw();
    lastDist = dist;
};

function loadPromise(obj) {
    return new Promise(resolve => {
        obj.addEventListener('load', (e) => {
            resolve(e);
        });
    });
}

// イメージオブジェクトを基に描画
function drawImage(imageObj, stage, option={}, layer=null) {
    if (!layer) layer = new Konva.Layer();
    const HWRation = calcRation(imageObj.height, imageObj.width);
    option = {
        image: imageObj,
        x: option.x || 50,
        y: option.y || 50,
        width: option.width || imageObj.width * HWRation,
        height: option.height || imageObj.height * HWRation,
        draggable: option.draggable || false,
        stroke: option.stroke || null,
        strokeWidth: option.strokeWidth || null,
        name: option.name || null
    };

    const image = new Konva.Image(option);

    layer.add(image);
    stage.add(layer);
    return layer;
}

// 2点間の距離を求める
function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

// 縦横の倍率を求める
function calcRation(height, width, targetStage=null) {
    if (!targetStage) {
        targetStage = stage;
    }
    const HRation = targetStage.height() / height;
    const WRation = targetStage.width() / width;
    return (HRation > 1 && WRation > 1) ?
        1 : Math.min(HRation, WRation);
}

const getCount = function() {
    let c = 0;
    return () => c++;
}();

const logDom = document.getElementById('log');
function printLog(...arguments) {
    const args = ((typeof arguments === 'string' || arguments.length === 1)
                  ? [arguments]
                  : Array.apply(null, arguments));
    const str = args.reduce((x, res) => {
        return x + res;
    });
    logDom.innerHTML = str + '<br>' + logDom.innerHTML;
}
