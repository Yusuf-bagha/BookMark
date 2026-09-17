var bookMarkNameInput = document.getElementById("bookMarkName");
var bookMarkUrlInput = document.getElementById("bookMarkUrl");
var bookmarkForm = document.getElementById("bookmarkForm");
var msgDuplicate = document.getElementById("msgDuplicate");
var tableContent = document.getElementById("tableContent");
var siteContainer = [];

if (localStorage.getItem("sitelist") !== null) {
    siteContainer = JSON.parse(localStorage.getItem("sitelist"));
} else {
    siteContainer = [];
}

display();


bookmarkForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addSite();
});

function addSite() {
    msgDuplicate.classList.add("d-none");

    var nameIsValid = validationName();
    var urlIsValid = validationUrl();

    if (!nameIsValid || !urlIsValid) {
        return;
    }

    var name = bookMarkNameInput.value.trim();
    var url = bookMarkUrlInput.value.trim();

    var isDuplicate = siteContainer.some(function (site) {
        return site.bookMarkName.toLowerCase() === name.toLowerCase();
    });

    if (isDuplicate) {
        msgDuplicate.classList.remove("d-none");
        return;
    }

    var site = {
        bookMarkName: name,
        bookMarkUrl: url
    };

    siteContainer.push(site);
    localStorage.setItem("sitelist", JSON.stringify(siteContainer));
    display();
    clear();
}

function display() {
    if (siteContainer.length === 0) {
        tableContent.innerHTML = `
            <tr>
                <td colspan="4" class="text-muted py-3">No bookmarks yet — add your first site above.</td>
            </tr>`;
        return;
    }

    var siteBox = "";
    for (var i = 0; i < siteContainer.length; i++) {
        var safeName = escapeHTML(siteContainer[i].bookMarkName);
        siteBox += `<tr>
                        <th scope="row" class="text-center">${i + 1}</th>
                        <td class="text-center text-break">${safeName}</td>
                        <td class="text-center">
                            <button type="button" class="btn btn-visit btn-success" onclick="visitSite(${i})">
                                <i class="fa-solid fa-eye pe-2"></i>Visit
                            </button>
                        </td>
                        <td class="text-center">
                            <button type="button" class="btn btn-delete btn-danger" onclick="deleteSite(${i})">
                                <i class="fa-solid fa-trash-can pe-2"></i>Delete
                            </button>
                        </td>
                    </tr>`;
    }
    tableContent.innerHTML = siteBox;
}


function visitSite(index) {
    var url = siteContainer[index].bookMarkUrl;
    window.open(url, "_blank", "noopener,noreferrer");
}

function deleteSite(deletedIndex) {
    var confirmed = window.confirm("Remove this bookmark?");
    if (!confirmed) {
        return;
    }
    siteContainer.splice(deletedIndex, 1);
    localStorage.setItem("sitelist", JSON.stringify(siteContainer));
    display();
}

function clear() {
    bookMarkNameInput.value = "";
    bookMarkUrlInput.value = "";
    bookMarkNameInput.classList.remove("is-valid", "is-invalid");
    bookMarkUrlInput.classList.remove("is-valid", "is-invalid");
}


function escapeHTML(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function validationName() {

    var regex = /^[A-Za-z][A-Za-z_]{2,19}$/;
    var text = bookMarkNameInput.value.trim();

    if (regex.test(text)) {
        bookMarkNameInput.classList.add("is-valid");
        bookMarkNameInput.classList.remove("is-invalid");
        msgName.classList.add("d-none");
        return true;
    } else {
        bookMarkNameInput.classList.add("is-invalid");
        bookMarkNameInput.classList.remove("is-valid");
        msgName.classList.remove("d-none");
        return false;
    }
}

function validationUrl() {
    var regex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&/=]*)$/;
    var textUrl = bookMarkUrlInput.value.trim();

    if (regex.test(textUrl)) {
        bookMarkUrlInput.classList.add("is-valid");
        bookMarkUrlInput.classList.remove("is-invalid");
        msgUrl.classList.add("d-none");
        return true;
    } else {
        bookMarkUrlInput.classList.add("is-invalid");
        bookMarkUrlInput.classList.remove("is-valid");
        msgUrl.classList.remove("d-none");
        return false;
    }
}