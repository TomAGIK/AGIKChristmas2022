// This class is just a nice way of referencing all the gameobjects within a
// certain 'screen' of the interactive
// -> essentially a collection of objects that should all be shown together

export class Screen extends Phaser.GameObjects.Container {

    constructor(scene, x, y, children) {

        super(scene, x, y, []);
        scene.add.existing(this);

        // array of all identifiers of the screen's children for easy access
        this.childNames = Object.keys(children);

        // add all children to the container
        this.childNames.forEach(child => {
            this[child] = children[child];
            this.add(this[child]);
        });

    }

}
