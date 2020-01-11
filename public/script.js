const receitas = document.querySelectorAll('.receita')
const closeModal = document.querySelector('.closeModal')
const closeModal2 = document.querySelector('.closeModal2')
const closeModal3 = document.querySelector('.closeModal3')

for (let receita of receitas) {
    receita.addEventListener('click', function() {
        const receitaId = receita.getAttribute('id')
        window.location.href = `/receita?id=${receitaId}`
    })
}


closeModal.addEventListener("click", function() {
    if (closeModal.innerHTML === "ESCONDER") {
        document.querySelector(".edit").style.display = "none"
        closeModal.innerHTML = "MOSTRAR"    
    } else if (closeModal.innerHTML === "MOSTRAR") {
        document.querySelector(".edit").style.display = "block"
        closeModal.innerHTML = "ESCONDER"
    }
})

closeModal2.addEventListener("click", function() {
    if (closeModal2.innerHTML === "ESCONDER") {
        document.querySelector(".edit2").style.display = "none"
        closeModal2.innerHTML = "MOSTRAR"    
    } else if (closeModal2.innerHTML === "MOSTRAR") {
        document.querySelector(".edit2").style.display = "block"
        closeModal2.innerHTML = "ESCONDER"
    }
})

closeModal3.addEventListener("click", function() {
    if (closeModal3.innerHTML === "ESCONDER") {
        document.querySelector(".edit3").style.display = "none"
        closeModal3.innerHTML = "MOSTRAR"    
    } else if (closeModal3.innerHTML === "MOSTRAR") {
        document.querySelector(".edit3").style.display = "block"
        closeModal3.innerHTML = "ESCONDER"
    }
})