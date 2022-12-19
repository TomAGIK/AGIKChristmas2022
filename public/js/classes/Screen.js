// This class is just a nice way of referencing all the gameobjects within a
// certain 'screen' of the interactive
// -> essentially a collection of objects that should all be shown together

// Reason this is not just a regular phaser container is so the container
// children can be referenced and are set as properties outside of the main code

export class Screen extends Phaser.GameObjects.Container {

    constructor(scene, children, x=0, y=0) {

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
