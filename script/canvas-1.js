// https://www.tam-tam.co.jp/tipsnote/javascript/post13538.html
// https://konvajs.org/docs/sandbox/Multi-touch_Scale_Shape.html
// https://konvajs.org/docs/drag_and_drop/Drag_an_Image.html

const canvasDom = document.getElementById('container');
const canvasWidth = canvasDom.clientWidth || window.innerWidth;
const canvasHeight = canvasDom.clientHeight || 800;
let stage = null;
let activeShape = null;
let lastDist = 0;

const windowLoadPromise = loadPromise(window);
windowLoadPromise.then(() => {
    stage = new Konva.Stage({
        container: 'container',
        width: canvasWidth,
        height: canvasHeight
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
                name: 'selectedImage' + getCount(),
            });
        });
        // ファイル読み込みを実行
        reader.readAsDataURL(fileData);
    });

    stage.on('tap', e => {
        const shape = e.target;
        activeShape = activeShape && activeShape.getName() === shape.getName()
            ? null
            : shape;
    });

    stage.getContent().addEventListener(
        'touchmove',
        event => {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];

            if (touch1 && touch2 && activeShape && activeShape.getName()) {
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
                activeShape.getLayer().draw();
                lastDist = dist;
            }
        });
    stage.getContent().addEventListener(
        'touchend',
        () =>{
          lastDist = 0;
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

function eventPromise(obj, eventName) {
    return new Promise(resolve => {
        obj.addEventListener(eventName, (e) => {
            resolve(e);
        });
    });
}
function loadPromise(obj) {return eventPromise(obj, 'load');}

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

