export function getBottom(gameObject) {
    // Returns the y value of the bottom of the object

    let startPoint = gameObject.y;
    let origin = gameObject.originY;
    let height = gameObject.displayHeight;
    let offset = height * origin;

    let bottom = height - offset + startPoint;

    return bottom;

}
