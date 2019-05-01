var width = window.innerWidth;
var height = window.innerHeight;

var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});

var layer = new Konva.Layer();

var star = new Konva.Star({
    innerRadius: 20,
    outerRadius: 50,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 5,
    numPoints: 5,
    x: 60,
    y: 60,
    draggable: true,
    shadowOffset: { x: 5, y: 5 },
    shadowColor: 'black',
    shadowBlur: 5,
    shadowOpacity: 0.5
});

layer.add(star);
stage.add(layer);
star.cache();

var clone;
for (var n = 0; n < 10; n++) {
    clone = star.clone({
        x: Math.random() * stage.width(),
        y: Math.random() * stage.height(),
    });
    clone.cache();
    layer.add(clone);
}

layer.draw();
