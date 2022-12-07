export function getLeft(gameObject) {
    // Returns the x value of the left of the object

    let startPoint = gameObject.x;
    let origin = gameObject.originX;
    let width = gameObject.displayWidth;
    let offset = width * origin;

    let left = startPoint - offset;

    return left;

}
