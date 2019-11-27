import { createRadical } from "../../src/layout/root/create-radical";


const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const radicals = [
    createRadical(0.6, 0.7),
    createRadical(3, 1.4),
];
const contour = radicals[0].contours[0];
radicals[0].contours = [
    [
        contour[0],
        
    ]
];


const renderContours = (contours) => {
    for (const contour of contours){
        ctx.beginPath();
        ctx.moveTo(contour[0].x, contour[0].y);
        for (let i = 1; i < contour.length; i++){
            ctx.lineTo(contour[i].x, contour[i].y);
        }
        ctx.closePath();
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.restore();

        for (const [index, point] of contour.entries()){
            ctx.save();
            ctx.translate(point.x, point.y);
            
            ctx.beginPath();
            ctx.arc(0, 0, 0.005, 0, Math.PI * 2);
            ctx.fillStyle = point.onCurve ? "lime" : "purple";
            ctx.fill();

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "1px sans-serif";
            ctx.fillStyle = "white";
            ctx.scale(0.025, -0.025);
            ctx.fillText(index.toString(), 0.8, 0);

            ctx.restore();
        }
    }
};

const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    
    ctx.setTransform(700, 0, 0, -700, 0, 0, 0);

    let y = 0;
    for (let i = 0; i < radicals.length; i++){
        const radical = radicals[i];
        y += -radical.dimensions.yMax - 0.2;
        
        ctx.save();
        ctx.translate(0, y);
        renderContours(radical.contours);
        ctx.restore();

        y += radical.dimensions.yMin - 0.2;
    }

    ctx.restore();
};

render();