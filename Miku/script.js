document.addEventListener("DOMContentLoaded", function() {
    playlist = document.getElementById("playlist");

    titleScreen = document.getElementById("autoplay-cover");
    titleScreen.innerHTML =
        `<img src="assets/scary_miku.gif" draggable="false">
        <p style="color: #C1B492; bottom: 50px;">
        Ｆａｒ　ｓｔｒｏｎｇｅｒ　ｂｅｉｎｇｓ　ｔｈａｎ　ｙｏｕ　ｈａｖｅ　ｔｒｉｅｄ　ｉｎ　ｖａｉｎ　ｔｏ　ｓｉｌｅｎｃｅ　ｈｅｒ　ｖｏｉｃｅ．．．<br>
            <br>
            Ｄｏ　ｎｏｔ　ｒｅｐｅａｔ　ｔｈｅｉｒ　ｆｏｌｌｙ .

            <br><br><br><br><br><br>
            <span style="color: #615538; font-size: 12px;">Ｐｌｅａｓｅ　ｍａｋｅ　ｓｕｒｅ　＇Ａｕｔｏｐｌａｙ＇　ｉｓ　ａｌｌｏｗｅｄ　ｉｎ　ｙｏｕｒ　ｂｒｏｗｓｅｒ　ｓｅｔｔｉｎｇｓ.<\span>
        </p>`;

    document.body.appendChild(titleScreen);
    titleScreen.addEventListener("click", function() {
        titleScreen.className = "hide"
        console.log("hiding title");
        setTimeout(function() {
            document.body.removeChild(titleScreen)
        },
        500);

        playlist.innerHTML = `<iframe src="https://www.youtube.com/embed/videoseries?list=PL_adIwvX7O3VVjxKP5UuWFIfqvbBoLTtw&autoplay=1&loop=1&shuffle=1" allowfullscreen="" width="0" height="0" frameborder="0"></iframe>`;
    }) 
});