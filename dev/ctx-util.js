export const pathPolyline = (ctx, points) => {
    ctx.moveTo(...points[0]);
    points.slice(1).forEach(point => ctx.lineTo(...point));
};
export const strokePolyline = (points) => (ctx => {
    ctx.beginPath();
    pathPolyline(ctx, points);
    ctx.stroke();
});
export const fillFlippedText = (text, x=0, y=0, scale=1) => (ctx => {
    ctx.save();
    ctx.translate(x, y);
    scaleUniform(scale)(ctx);
    ctx.scale(1, -1);
    ctx.fillText(text, 0, 0);
    ctx.restore();
});
export const scaleUniform = (scale) => (ctx => ctx.scale(scale, scale));

export const strokeHorizontalLine = (x1, x2, y, lineWidth=1) => (ctx => strokePolylineWithIdentityMatrix([[x1, y], [x2, y]], ctx, lineWidth));
export const strokePolylineWithIdentityMatrix = (polyline, ctx, lineWidth=1) => {
    ctx.beginPath();
    pathPolyline(ctx, polyline);
    strokeWithIdentityMatrix(ctx, lineWidth);
};
export const strokeWithIdentityMatrix = (ctx, lineWidth=1) => {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.restore();
};