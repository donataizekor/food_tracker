import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js"

//initializing app
const appSettings = {
    //databaseURL is an actual keyword
    databaseURL : "https://grumpy-428d3-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)

//db
const database = getDatabase(app)
const refFoodToDB = ref(database, 'food')

//addItem.html
const itemInput = document.querySelector('#item-input')
const quantityInput = document.querySelector('#quantity-input')
const bBeforeInput = document.querySelector('#b-before-input')
const locationInput = document.querySelector('#location-input')

const btnAddItem = document.querySelector('.btn-addItem')


//itemsRender.html
const itemList = document.querySelector('.container-list-items')
const dateEl = document.querySelector('.item-date')
const itemEl = document.querySelector('.item-info')
const locationEl = document.querySelector('.item-location')


let itemArray = []

function addItem(){
   const inputValue = itemInput.value
   const quantityValue = quantityInput.value
   const bBeforeValue = bBeforeInput.value
   const locationValue = locationInput.value
   
   if(inputValue === ""){
    alert("please enter item")
   }else{
    itemArray.push(inputValue, quantityValue, bBeforeValue, locationValue)
    push(refFoodToDB, itemArray)
    resetInput()
   }
}

function resetInput(){
    itemInput.value = ""
    quantityInput.value = ""
    bBeforeInput.value = ""
    locationInput.value = ""

    itemArray = []
}

//listening to changes from the database
onValue(refFoodToDB, function(snapshot){
    if(snapshot.exists()){
        const foodArray = Object.entries(snapshot.val())

        clearPage()
        for (let i of foodArray){
            let currentItem = i
            let [currentItemID, currentItemArrayofValues] = currentItem
            appendItem(currentItem)            
        }
    }else{
        itemList.innerHTML = `<p>No items added yet</p>`
    }
})


//appending items to itemsRender.html
function appendItem(item){
    let [itemID, itemValue] = item
    
    itemList.innerHTML += `
            <div class="item-row">
                <div class="date">
                    <h3>Best before</h3>
                    <p>${dateEl.innerHTML = itemValue[2]}</p>
                </div>
                
                <div class="item-info">
                    <h3>Item</h3>
                    <p>${itemEl.innerHTML = `${itemValue[1]}, ${itemValue[0]}`}</p>
                </div>
                <div class="item-location">
                    <h3>Location</h3>
                    <p>${locationEl.innerHTML = itemValue[3]}</p>
                </div>
                <div>
                    <button>x</button>
                <div>
            </div>
        `

    //deleting item from db
    const delBtn = document.querySelector('.item-row button')
    delBtn.addEventListener('dblclick', function (){
        const itemExactLocationInDB = ref(database, `food/${itemID}`)
        remove(itemExactLocationInDB)    
    })
}

//clearing the page from the previous version so the new one can be appended
function clearPage(){
    itemList.innerHTML = ""
}


// const cards = document.querySelectorAll('.card')
//         for (let i of cards){
//             i.addEventListener('click', (e) =>{

//                 if(e.target.classList.contains('fridge')){
//                     console.log('yayy');
//                 };
//             })
//         }

btnAddItem.addEventListener('click', addItem)