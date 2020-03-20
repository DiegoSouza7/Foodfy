const currentPage = location.pathname
const receitas = document.querySelectorAll('.receita')
const closeModal = document.querySelector('.closeModal')
const closeModal2 = document.querySelector('.closeModal2')
const closeModal3 = document.querySelector('.closeModal3')
const pagination = document.querySelector('.pagination')
const chefs = document.querySelectorAll('.amostraChefs')
const buscandoPor = document.querySelector('.buscandoPor')
const create = location.pathname
const galleryPreview = document.querySelector('.gallery-preview')

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

// Imagens

function verifLimit(create) {
    if(create == `/adm/chefs/create`) {
        return 1
    }else {
        return 5
    }
}

const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: verifLimit(create),
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target
        
        if (PhotosUpload.hasLimit(event)) return
        
        
        Array.from(fileList).forEach(file => {
            PhotosUpload.files.push(file)
            const reader = new FileReader()
            
            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)
                
                const div = PhotosUpload.getContainer(image)
                
                PhotosUpload.preview.appendChild(div)
            }
            
            reader.readAsDataURL(file)
        })
        
        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList } = input
        
        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }
        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo")
            photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length
        
        if(totalPhotos > uploadLimit) {
            alert("Você atingiu o limite máximo de fotos")
            event.preventDefault()
            return true
        }
        
        
        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()
        
        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))
        
        return dataTransfer.files
        
    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')
        
        div.onclick = PhotosUpload.removePhoto
        
        div.appendChild(image)
        
        div.appendChild(this.getRemoveButton())
        
        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = 'close'
        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)
        
        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()
        
        photoDiv.remove()
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode
        
        if(photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')
            if(removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }
        
        photoDiv.remove()
    }
}

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))

        target.classList.add('active')

        ImageGallery.highlight.src = target.src
    }
}

const Validate = {
    apply(input, func) {
        Validate.clearErros(input)
        let results = Validate[func](input.value)
        input.value = results.value
        if (results.error) Validate.displayError(input, results.error)

    },
    displayError(input, error) {
        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = error
        input.parentNode.appendChild(div)
        input.focus()
    },
    clearErros(input) {
        const errorDiv = input.parentNode.querySelector('.error')
        if (errorDiv) errorDiv.remove()
    },
    isEmail(value) {
        let error = null

        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!value.match(mailFormat)) error = "Email inválido"

        return {
            error,
            value
        }
    }
}

// inserir templateColumns no preview


if (galleryPreview) {
    const idRecipe = document.querySelector('.idRecipe')
    const id = idRecipe.value

    if(currentPage == `/adm/${id}` || currentPage == `/receita${id}`) {
        const imgs = document.querySelectorAll('.gallery-preview img')
        const total = imgs.length

        document.querySelector('.gallery-preview').style.gridTemplateColumns = `repeat(${total}, 1fr)`
    }
}



