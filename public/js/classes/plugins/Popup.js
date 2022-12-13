// Create a popup that dims the background and shows all the children added to it
// The popups use different methods than the usual setVisible to show and hide, due to
// this allowing for entrance and exit animations to be utilised rather than simply appearing

export class PopupGameObject extends Phaser.GameObjects.Container {

    constructor(scene, x, y, children) {
        super(scene, x, y, []);

        // array of all identifiers of the screen's children for easy access
        this.childNames = Object.keys(children);

        // Dim the background
        // this.dullBackground = scene.add.rectangle(scene.center.x, scene.center.y, scene.gameWidth, scene.gameHeight, 0x000000, 0.5);
        // this.dullBackground.setInteractive().on("pointerup", () => this.setVisible(false));
        // this.add(this.dullBackground);

        // add all children to the container
        this.childNames.forEach(child => {
            this[child] = children[child];
            this.add(this[child]);
        });

    }

    show() {
        // To do, run a zoom intro animation
        this.setVisible(true);
        return this;
    }

    hide() {
        // To do, run a shrink intro animation
        this.setVisible(false);
        return this;
    }

}

export class PopupPlugin extends Phaser.Plugins.BasePlugin {

    // Plugin code to allow for scene.add.popup

    constructor(pluginManager) {
        super(pluginManager);

        pluginManager.registerGameObject('popup', this.createPopup);
    }

    createPopup(x, y, text, textStyle) {
        return this.displayList.add(new PopupGameObject(this.scene, x, y, text, textStyle));
    }
}
