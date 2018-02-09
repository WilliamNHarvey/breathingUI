/**
 * Created by William on 2018-02-09.
 */

var canvas = document.getElementById('nokey');

if(!canvas) {
    throw new Error("No canvas");
}

if(typeof(window.graphSet) === "undefined") {
    window.graphSet = false;
}
else {
    window.graphSet = true;
}


var ctx = canvas.getContext('2d'),
    can_w = parseInt(window.innerWidth),
    can_h = parseInt(window.innerHeight);

function drawStuff() {
    'use strict';
    // Eventually... background drawings etc. Can be per page based on url location.
}

function resizeCanvas() {
    'use strict';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    can_w = parseInt(window.innerWidth);
    can_h = parseInt(window.innerHeight);

    drawStuff();
}
resizeCanvas();
// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);



var ball = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        r: 0,
        alpha: 1,
        phase: 0
    },
    ball_color = {
        r: 207,
        g: 255,
        b: 4
    },
    R = 2,
    balls = [],
    alpha_f = 0.03,
    alpha_phase = 0,

// Line
    link_line_width = 0.8,
    dis_limit = 260,
    add_mouse_point = true,
    mouse_in = false,
    mouse_ball = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        r: 0,
        type: 'mouse'
    };

function randomNumFrom(min, max){
    'use strict';
    return Math.random()*(max - min) + min;
}
// Random speed
function getRandomSpeed(pos){
    'use strict';
    var  min = -1,
        max = 1;
    switch(pos){
        case 'top':
            return [randomNumFrom(min, max), randomNumFrom(0.1, max)];
        case 'right':
            return [randomNumFrom(min, -0.1), randomNumFrom(min, max)];
        case 'bottom':
            return [randomNumFrom(min, max), randomNumFrom(min, -0.1)];
        case 'left':
            return [randomNumFrom(0.1, max), randomNumFrom(min, max)];
        default:
            return;
    }
}
function randomArrayItem(arr){
    'use strict';
    return arr[Math.floor(Math.random() * arr.length)];
}
function randomSidePos(length){
    'use strict';
    return Math.ceil(Math.random() * length);
}
// Random Ball
function getRandomBall(){
    'use strict';
    var pos = randomArrayItem(['top', 'right', 'bottom', 'left']);
    switch(pos){
        case 'top':
            return {
                x: randomSidePos(can_w),
                y: -R,
                vx: getRandomSpeed('top')[0],
                vy: getRandomSpeed('top')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'right':
            return {
                x: can_w + R,
                y: randomSidePos(can_h),
                vx: getRandomSpeed('right')[0],
                vy: getRandomSpeed('right')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'bottom':
            return {
                x: randomSidePos(can_w),
                y: can_h + R,
                vx: getRandomSpeed('bottom')[0],
                vy: getRandomSpeed('bottom')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'left':
            return {
                x: -R,
                y: randomSidePos(can_h),
                vx: getRandomSpeed('left')[0],
                vy: getRandomSpeed('left')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
    }
}


// Draw Ball
function renderBalls(){
    'use strict';
    Array.prototype.forEach.call(balls, function(b){
        if(!b.hasOwnProperty('type')){
            ctx.fillStyle = 'rgba('+ball_color.r+','+ball_color.g+','+ball_color.b+','+b.alpha+')';
            ctx.beginPath();
            ctx.arc(b.x, b.y, R, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
        }
    });
}

// Update balls
function updateBalls(){
    'use strict';
    var new_balls = [];
    Array.prototype.forEach.call(balls, function(b){
        b.x += b.vx;
        b.y += b.vy;

        if(b.x > -(50) && b.x < (can_w+50) && b.y > -(50) && b.y < (can_h+50)){
            new_balls.push(b);
        }

        // alpha change
        b.phase += alpha_f;
        b.alpha = Math.abs(Math.cos(b.phase));
        // console.log(b.alpha);
    });

    balls = new_balls.slice(0);
}

// loop alpha
function loopAlphaInf(){
    'use strict';

}

// calculate distance between two points
function getDisOf(b1, b2){
    'use strict';
    var  delta_x = Math.abs(b1.x - b2.x),
        delta_y = Math.abs(b1.y - b2.y);

    return Math.sqrt(delta_x*delta_x + delta_y*delta_y);
}

// Draw lines
function renderLines(){
    'use strict';
    var fraction, alpha;
    for (var i = 0; i < balls.length; i++) {
        for (var j = i + 1; j < balls.length; j++) {

            fraction = getDisOf(balls[i], balls[j]) / dis_limit;

            if(fraction < 1){
                alpha = (1 - fraction).toString();

                ctx.strokeStyle = 'rgba(150,150,150,'+alpha+')';
                ctx.lineWidth = link_line_width;

                ctx.beginPath();
                ctx.moveTo(balls[i].x, balls[i].y);
                ctx.lineTo(balls[j].x, balls[j].y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}



// add balls if there a little balls
function addBallIfy(){
    'use strict';
    if(balls.length < 50){
        balls.push(getRandomBall());
    }
}

// Render
function render(){
    'use strict';
    ctx.clearRect(0, 0, can_w, can_h);

    renderBalls();

    renderLines();

    updateBalls();

    addBallIfy();

    window.requestAnimationFrame(render);
}

// Init Balls
function initBalls(num){
    'use strict';
    for(var i = 1; i <= num; i++){
        balls.push({
            x: randomSidePos(can_w),
            y: randomSidePos(can_h),
            vx: getRandomSpeed('top')[0],
            vy: getRandomSpeed('top')[1],
            r: R,
            alpha: 1,
            phase: randomNumFrom(0, 10)
        });
    }
}
// Init Canvas
function initCanvas(){
    'use strict';
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);

    can_w = parseInt(canvas.getAttribute('width'));
    can_h = parseInt(canvas.getAttribute('height'));
}
window.addEventListener('resize', function(e){
    initCanvas();
});

function goMovie(){
    'use strict';
    initCanvas();
    initBalls(50);
    window.requestAnimationFrame(render);
}
if(!window.graphSet) {
    goMovie();
}


// Mouse effect
canvas.addEventListener('mouseenter', function(){
    mouse_in = true;
    balls.push(mouse_ball);
});
canvas.addEventListener('mouseleave', function(){
    mouse_in = false;
    var new_balls = [];
    Array.prototype.forEach.call(balls, function(b){
        if(!b.hasOwnProperty('type')){
            new_balls.push(b);
        }
    });
    balls = new_balls.slice(0);
});
canvas.addEventListener('mousemove', function(e){
    var e = e || window.event;
    mouse_ball.x = e.pageX;
    mouse_ball.y = e.pageY;
});