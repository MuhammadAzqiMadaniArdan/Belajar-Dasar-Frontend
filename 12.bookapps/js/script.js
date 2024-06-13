const books = [];
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';
const RENDER_EVENT = 'render-book';

console.log(`HEllo $books`);
document.addEventListener('DOMContentLoaded', function (){
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit',function (event){
        event.preventDefault();
        addBook();
    });
    if(isStorageExist()){
        loadDataFromStorage();
    }
});

function addBook(){
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const yearVal = document.getElementById('year').value;
    
    const generatedID = generatedId();
    const Completed = document.getElementById('completed');

    const checked = Completed.checked;    
    const year = parseInt(yearVal);
    const bookObject = generateBookObject(generatedID, title,author, year, checked);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generatedId(){
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted){
    return{
        id,
        title,
        author,
        year,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById('books');
    uncompletedBOOKList.innerHTML = '';

    const completedBOOKList = document.getElementById('completed-books');
    completedBOOKList.innerHTML = '';

    for (const bookItem of books){
        const bookElement = makeBook(bookItem);
        if(!bookItem.isCompleted)
            uncompletedBOOKList.append(bookElement);
        else
            completedBOOKList.append(bookElement);
    }
});

function makeBook(bookObject){
    const textTitle = document.createElement('h2');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis : ${bookObject.author}`;

    const textTimestamp = document.createElement('p');
    textTimestamp.innerText = `Tahun : ${bookObject.year}`;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle,textAuthor,textTimestamp);

    const container = document.createElement('div');
    container.classList.add('item','shadow');
    container.append(textContainer);
    container.setAttribute('id',`book-${bookObject.id}`);

    if(bookObject.isCompleted){
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function(){
            undoTaskFromCompleted(bookObject.id);

        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function (){
            removeTaskFromCompleted(bookObject.id);
        });

        container.append(undoButton, trashButton);
    }else{
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', function (){
            addTaskToCompleted(bookObject.id);
        });
        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function (){
            removeTaskFromCompleted(bookObject.id);
        });

        container.append(checkButton,trashButton);
    }

    return container;
}

function addTaskToCompleted(bookId){
    const bookTarget = findBook(bookId);

    if(bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId){
    for(const bookItem of books){
        if(bookItem.id === bookId){
            return bookItem;
        }
    }
    return null;
}

function removeTaskFromCompleted(bookId){
    const bookTarget = findBookIndex(bookId);

    if(confirm("Apa anda yakin ingin Menghapus ?") == true){

        alert('Buku Berhasil Dihapus!');

        if(bookTarget === -1) return;
    
        books.splice(bookTarget,1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
        
    }else{

        alert('Buku tidak dihapus!');
    }
}

function undoTaskFromCompleted(bookId){
    const bookTarget = findBook(bookId);

    if(bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId){
    for(const index in books){
        if(books[index].id === bookId){
            return index;
        }
    }

    return -1;
}

function saveData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));

    }
}


function isStorageExist()  {
    if(typeof(Storage) === undefined){
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));

});

function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if(data !== null) {
        for (const book of data){
            books.push(book);
        }
    }


    document.dispatchEvent(new Event(RENDER_EVENT));
}

function searchBook(){
    
    const search = document.getElementById('search');
    searchVal = search.value;
    
    var input,filter,list,h2,textValue,i;
    

    input = document.getElementById('search');
    filter = input.value.toUpperCase();
    list = document.getElementById('books');
    list2 = document.getElementById('completed-books')
    item1 = list.getElementsByClassName('item');
    item2 = list2.getElementsByClassName('item');
    h2 = list.getElementsByTagName('h2');
    h2C = list2.getElementsByTagName('h2');
    console.log(list,h2,item1,item2);

    for(i = 0;i < h2.length; i++){
        textValue = h2[i].textContent || h2[i].innerText;
        if(textValue.toUpperCase().indexOf(filter) >-1){
            item1[i].style.display = "";
        }else{
            item1[i].style.display = "none";
            
        }
    }
    for(i = 0;i < h2C.length; i++){
        textValue = h2C[i].textContent || h2C[i].innerText;
        if(textValue.toUpperCase().indexOf(filter) >-1){
            item2[i].style.display = "";
        }else{
            item2[i].style.display = "none";
            
        }
    }
}