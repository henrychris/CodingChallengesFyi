const BASE_URL = "http://localhost:3000";

function shortenUrl() {
    const originalUrl = document.getElementById("url-input").value;
    console.log(`Original Url: ${originalUrl}`);

    fetch(BASE_URL + "/shorten", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ longUrl: originalUrl }),
    })
        .then((response) => response.json())
        .then((result) => {
            console.log("Received Data:", result.data);

            let element = document.getElementById("shortened-url");
            element.type = "text";
            element.value = result.data.shortUrl;
            blockUserInputOnElement(element);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

// check for triple-click to auto-copy text
let shortendUrlBox = document.getElementById("shortened-url");
shortendUrlBox.addEventListener("click", function (evt) {
    if (evt.detail === 3) {
        navigator.permissions
            .query({ name: "clipboard-write" })
            .then((result) => {
                if (result.state == "granted" || result.state == "prompt") {
                    navigator.clipboard.writeText(shortendUrlBox.value);
                    console.log("Copied text to clipboard.");
                    // todo: add an alert or notice to the user.
                }
            });
    }
});

function blockUserInputOnElement(element) {
    element.addEventListener(
        "cut",
        function (e) {
            e.preventDefault();
        },
        false
    );
    element.addEventListener(
        "copy",
        function (e) {
            e.preventDefault();
        },
        false
    );
    element.addEventListener(
        "paste",
        function (e) {
            e.preventDefault();
        },
        false
    );
    element.addEventListener(
        "keydown",
        function (e) {
            e.preventDefault();
        },
        false
    );
}

// TODO: test application lol
