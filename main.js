const canvas = document.querySelector(".canvas");
const paint_color = document.querySelector(".input-color");
const screen_size = document.querySelector(".input-size");
const save_img_btn = document.querySelector(".btn-save");
const color_history_container = document.querySelector(".color-history")
const resize_bar = document.querySelector(".resize")
const colors_used = []

let previus_color = paint_color.value
let prev_mouseX = 0

document.addEventListener('DOMContentLoaded', () => {
    createScreen();  // Chama a função para construir a tela ao carregar
});

screen_size.addEventListener("change", () => {
    const size = screen_size.value;
    createScreen(size);  // Cria a tela com o novo tamanho quando o valor mudar
});

paint_color.addEventListener("change", () => {

    colors_used.push(previus_color)

    colorHistory()

    previus_color = paint_color.value
})

color_history_container.addEventListener("click", useColorHistory)

canvas.addEventListener("mousedown", () => {

    canvas.addEventListener("mousemove", draw_canvas)
    canvas.addEventListener("mouseup", finishDrawing)
})

resize_bar.addEventListener("mousedown", (event) => {

    prev_mouseX = event.clientX

    //console.log(prev_mouseX)

    window.addEventListener("mousemove", resizeScreen)
    window.addEventListener("mouseup", resizingFinished)
})

function createScreen(matriz = 10) {
    canvas.innerHTML = '';  // Limpa a tela antes de reconstruir
    for (let rw = 0; rw < matriz; rw++) {
        const row = document.createElement("div");
        row.setAttribute("class", "row");

        for (let px = 0; px < matriz; px++) {
            const pixel = document.createElement("div");
            pixel.setAttribute("class", "pixel");

            row.appendChild(pixel);
        }

        canvas.appendChild(row);  // Adiciona a linha à tela

        /*
        console.log(`------------------------------------------\n
            Linha (${rw}): ${row}
            \n------------------------------------------`);
        
        if (rw === matriz - 1) {
            console.log("Matriz construída");
        }

        */
    }
}

function draw_canvas(event) {
    const current_pixel = event.target

    if (current_pixel.className === "pixel") {
        current_pixel.style.backgroundColor = paint_color.value
    }
}

function finishDrawing() {

    console.log("Desenho terminado")

    canvas.removeEventListener("mousemove", draw_canvas)
    canvas.removeEventListener("mouseup", finishDrawing)
}

function useColorHistory(event) {
    const selected_color = event.target

    let bg_color = (window.getComputedStyle(selected_color)).getPropertyValue("background-color")

    paint_color.value = rgbToHex(bg_color)
}

function colorHistory() {
    color_history_container.innerHTML = ''

    colors_used.forEach(color => {
        const btn_color = document.createElement("button")
        btn_color.style.backgroundColor = color
        btn_color.setAttribute("class", "btn-color")

        color_history_container.firstChild ? color_history_container.insertBefore(btn_color, color_history_container.firstChild) : color_history_container.appendChild(btn_color)
        
    })
}

function resizeScreen(event) {
    const current_mouseX = event.clientX

    let width_canvas = (window.getComputedStyle(canvas)).getPropertyValue("width").replace("px", "")
    let height_resize_bar = (window.getComputedStyle(resize_bar)).getPropertyValue("height").replace("px", "")

    let width = Number(width_canvas)
    let height = Number(height_resize_bar)

    if (current_mouseX > prev_mouseX) {
        canvas.style.width = `${width+1}px`
        resize_bar.style.height = `${height+1}px`
    }

    else {
        canvas.style.width = `${width-1}px`
        resize_bar.style.height = `${height-1}px`
    }

    prev_mouseX = event.clientX

    console.log(`canvas: ${Number(width_canvas)}\nResize bar: ${Number(height_resize_bar)}`)
}

function resizingFinished() {

    console.log("Redimensionamento terminado")

    window.removeEventListener("mousemove", resizeScreen)
    window.removeEventListener("mouseup", resizingFinished)
}

// Função para converter RGB para Hex
function rgbToHex(rgb) {
    // Extrai os valores R, G, B do formato 'rgb(r, g, b)'
    const rgbArray = rgb.match(/\d+/g);
    const r = parseInt(rgbArray[0]);
    const g = parseInt(rgbArray[1]);
    const b = parseInt(rgbArray[2]);

    // Converte para hexadecimal e garante que tenha 2 dígitos para cada cor
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase()}`;
}