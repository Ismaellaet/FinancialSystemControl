const html = document.querySelector('html');
const checkbox = document.querySelector('input[type=checkbox]');

const getStyle = (element, style) => {
   return window.getComputedStyle(element).getPropertyValue(style);
}

const lightTheme = {
    text: getStyle(html, "--text"),
    header: getStyle(html, "--header"),
    green: getStyle(html, "--green"),
    mainShape: getStyle(html, "--main-shape"),
    secundaryShape: getStyle(html, "--secundary-shape")
}

const darkTheme = {
    text: "white",
    header: "none",
    green: "#138C40",
    mainShape: "#151B28",
    secundaryShape: "#151B28"
}

const transformKey = (key) => {
    return "--" + key.replace(/([A-Z])/, "-$1").toLowerCase()
}

const changeTheme = (theme) => {
        Object.keys(theme).map((key) => {
            html.style.setProperty(transformKey(key), theme[key])
        })
}

checkbox.addEventListener('change', ({target}) => {
    document.body.classList.toggle('dark');

    target.checked ? changeTheme(darkTheme) : changeTheme(lightTheme);
})