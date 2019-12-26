//Variables
const carrito = document.getElementById("carrito");
const cursos = document.getElementById("lista-cursos");
const listaCursos = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");

//Listeners
cargarEventListeners();

function cargarEventListeners(){
    //Dispara cuando se presiona agregar carrito
    cursos.addEventListener("click", comprarCurso);

    //Cuando se elimina un curso del carrito
    carrito.addEventListener("click", eliminarCurso);

    vaciarCarritoBtn.addEventListener("click", vaciarCarrito);

    //al cargar el DOM mostrar localstorage
    document.addEventListener("DOMContentLoaded", leerLocalStorage);
}

//Funciones
//Funcion que añade curso al carrito
function comprarCurso(e){
    e.preventDefault();

    //Delegation para agregar-carrito
    if(e.target.classList.contains("agregar-carrito")){
        const curso = e.target.parentElement.parentElement;
        //Enviamos del curso seleccionado para tomar sus datos
        leerDatosCurso(curso);
    }
}

function leerDatosCurso(curso){
    const infoCurso = {
        imagen: curso.querySelector("img").src,
        titulo: curso.querySelector("h4").textContent,
        precio: curso.querySelector(".precio span").textContent,
        id: curso.querySelector("a").getAttribute("data-id")
    }
    insertarCarrito(infoCurso);
}

function insertarCarrito(curso){
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>
            <img src="${curso.imagen}" width="100">
        </td>
        <td>${curso.titulo}</td>
        <td>${curso.precio}</td>
        <td>
            <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
        </td>
    `;
    listaCursos.appendChild(row);

    guardarCursoLocalStorage(curso);
}

function eliminarCurso(e){
    e.preventDefault();

    let curso;
    if(e.target.classList.contains("borrar-curso")){
        e.target.parentElement.parentElement.remove();
        curso = e.target.parentElement.parentElement;
        cursoId = curso.querySelector("a").getAttribute("data-id");
    }

    eliminarCursoLocalStorage(cursoId);
}

//Eliminar los cursos del carrito en el DOM
function vaciarCarrito(){
    //forma lenta
    //listaCursos.innerHTML = "";

    //forma rapida (recomendada)
    while(listaCursos.firstChild){
        listaCursos.removeChild(listaCursos.firstChild);
    }
    
    //Vaciar localStorage
    vaciarLocalStorage();

    return false;

}

//Almacena cursos en el carrito del localStorage
function guardarCursoLocalStorage(curso) {
    let cursos;
    //Toma el valor de un arreglo con datos de LS o vacio
    cursos = obtenerCursosLocalStorage();

    //Cursos seleccionado se agrega al arreglo
    cursos.push(curso);

    localStorage.setItem("cursos", JSON.stringify(cursos))
}

function obtenerCursosLocalStorage() {
    let cursosLS;

    if(localStorage.getItem("cursos") === null){
        cursosLS = [];
    }else{
        cursosLS = JSON.parse( localStorage.getItem("cursos") );
    }

    return cursosLS;
}

//Imprime los cursos de local Storage en el carrito

function leerLocalStorage(){
    let cursosLS;

    cursosLS = obtenerCursosLocalStorage();

    cursosLS.forEach(function(curso){
        //Construir el Template
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <img src="${curso.imagen}" width="100">
            </td>
            <td>${curso.titulo}</td>
            <td>${curso.precio}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
            </td>
        `;
        listaCursos.appendChild(row);
    });
}

//Elimina el curso por el Id en local Storage
function eliminarCursoLocalStorage(curso){
    let cursosLS;
    //Obtenemos el arreglo de cursos
    cursosLS = obtenerCursosLocalStorage();
    //Iteramos comparando el ID del curso borrado con los del LS
    cursosLS.forEach(function(cursoLS, index) {
        if(cursoLS.id === curso) {
            cursosLS.splice(index, 1);
        }
    });
    //Añadimos el arreglo actual al storage
    localStorage.setItem("cursos", JSON.stringify(cursosLS));
}

//Elimina todos los cursos de localStorage
function vaciarLocalStorage(){
    localStorage.clear();
}