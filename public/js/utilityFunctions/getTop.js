export function getTop(gameObject) {
    // Returns the y value of the top of the object

    let startPoint = gameObject.y;
    let origin = gameObject.originY;
    let height = gameObject.displayHeight;
    let offset = height * origin;

    let top = startPoint - offset;

    return top;

}
