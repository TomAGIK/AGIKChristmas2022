<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>AGuyIKnow Christmas 2022</title>

        <link rel="stylesheet" href="/css/app.css">

        <link rel="preload" as="font" href="/fonts/Kid Games.ttf" type="font/ttf" />

    </head>
    <body>
        <div id="loadFont" style="font-family:Score; position:absolute; left:-1000px; visibility:hidden;">.</div>
        <div id="phaser">
        </div>
        <script src="/js/lib/phaser/phaser.min.js"></script>
        <script type ="module" src="/js/game.js"></script>
        <script type ="module" src="/js/constants/dimensions.js"></script>
    </body>
</html>
