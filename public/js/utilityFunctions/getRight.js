export function getRight(gameObject) {
    // Returns the x value of the right of the object

    let startPoint = gameObject.x;
    let origin = gameObject.originX;
    let width = gameObject.displayWidth;
    let offset = width * origin;

    let right = startPoint + width - offset;

    return right;

}
