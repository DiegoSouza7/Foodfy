const currentPage = location.pathname
const receitas = document.querySelectorAll('.receita')
const closeModal = document.querySelector('.closeModal')
const closeModal2 = document.querySelector('.closeModal2')
const closeModal3 = document.querySelector('.closeModal3')
const pagination = document.querySelector('.pagination')
const chefs = document.querySelectorAll('.amostraChefs')
const buscandoPor = document.querySelector('.buscandoPor')

for (let receita of receitas) {
    receita.addEventListener('click', function() {
        const receitaId = receita.getAttribute('id')
        window.location.href = `/receita${receitaId}`
    })
}

for (let chef of chefs) {
    chef.addEventListener('click', function() {
        const chefId = chef.getAttribute('id')
        window.location.href = `/chef${chefId}`
    })
}

function close1(closeModal) {
    closeModal.addEventListener("click", function() {
        if (closeModal.innerHTML === "ESCONDER") {
            document.querySelector(".edit").style.display = "none"
            closeModal.innerHTML = "MOSTRAR"    
        } else if (closeModal.innerHTML === "MOSTRAR") {
            document.querySelector(".edit").style.display = "block"
            closeModal.innerHTML = "ESCONDER"
        }
    })
}

function close2(closeModal2) {
    closeModal2.addEventListener("click", function() {
        if (closeModal2.innerHTML === "ESCONDER") {
            document.querySelector(".edit2").style.display = "none"
            closeModal2.innerHTML = "MOSTRAR"    
        } else if (closeModal2.innerHTML === "MOSTRAR") {
            document.querySelector(".edit2").style.display = "block"
            closeModal2.innerHTML = "ESCONDER"
        }
    })
}

function close3(closeModal3) {
    closeModal3.addEventListener("click", function() {
        if (closeModal3.innerHTML === "ESCONDER") {
            document.querySelector(".edit3").style.display = "none"
            closeModal3.innerHTML = "MOSTRAR"    
        } else if (closeModal3.innerHTML === "MOSTRAR") {
            document.querySelector(".edit3").style.display = "block"
            closeModal3.innerHTML = "ESCONDER"
        }
    })
}

//funcão de paginacão

function paginate(selectedPage, totalPages) {
    let pages = [],
        oldPage

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {

        const firstAndLastPage = currentPage == 1 || currentPage == totalPages
        const pagesAfterSelectedPage = currentPage <= selectedPage + 2
        const pagesBeforeSelectedPage = currentPage >= selectedPage - 2

        if (firstAndLastPage || pagesAfterSelectedPage && pagesBeforeSelectedPage) {
            if(oldPage && currentPage - oldPage > 2) {
                pages.push("...")
            }

            if(oldPage && currentPage - oldPage == 2) {
                pages.push(oldPage + 1)
            }

            pages.push(currentPage)

            oldPage = currentPage
        }
    }

    return pages
}

function createpagination(pagination) {
    const filter = pagination.dataset.filter
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total
    const pages = paginate(page, total)

    let elements = ''

    for (let page of pages) {
        if(String(page).includes("...")) {
            elements += `<span>${page}</span>`
        } else {
            if(filter) {
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
            } else {
                elements += `<a href="?page=${page}">${page}</a>`
            }
        }
    }
    pagination.innerHTML = elements
}

// função mostrar o que esta sendo filtrado na busca

function mostrarFiltro(buscandoPor) {
    document.querySelector('.buscandoPor').style.display = "block"
}

if(closeModal) {
    close1(closeModal)
}

if(closeModal2) {
    close2(closeModal2)
}

if(closeModal3) {
    close3(closeModal3)
}

if (pagination) {
    if(pagination.dataset.page) {
        if (pagination.dataset.total > 1) {
            createpagination(pagination)
        }
    }
    if (pagination.dataset.filter) {
        mostrarFiltro(buscandoPor)
    }
}
