const sizes = {
    buttonPaddingX: 20,
    buttonPaddingY: 15,
};

export class ButtonGameObject extends Phaser.GameObjects.Container {

    constructor(scene, x, y, text, textStyle) {

        // Create a button object, which will be a container holding a text
        // object and the designed button image re-sized as appropriate

        // TODO - add the button image -> currently the container holds text
        // and a rectangle object as a placeholder for the image

        super(scene, x, y, []);
        this.text = scene.add.text(0, 0, text, textStyle).setOrigin(0.5);
        this.background = scene.add.rectangle(0, 0, this.text.displayWidth + sizes.buttonPaddingX, this.text.displayHeight + sizes.buttonPaddingY, 0xff0000).setOrigin(0.5);
        this.add([this.background, this.text]);
        this.setSize(this.background.displayWidth, this.background.displayHeight);
        this.setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.setScale(0.9))
        .on('pointerup', () => this.setScale(1))
        .on('pointerover', () => this.background.setFillStyle(0xcc0000))
        .on('pointerout', () => { this.background.setFillStyle(0xff0000); this.setScale(1) });
    }

}

export class ButtonPlugin extends Phaser.Plugins.BasePlugin {

    // Plugin code to allow for scene.add.button

    constructor(pluginManager) {
        super(pluginManager);

        pluginManager.registerGameObject('button', this.createButton);
    }

    createButton(x, y, text, textStyle) {
        return this.displayList.add(new ButtonGameObject(this.scene, x, y, text, textStyle));
    }
}
