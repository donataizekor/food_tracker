import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js"

const appSettings = {
    //databaseURL is an actual keyword
    databaseURL : "https://grumpy-428d3-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)

const refFoodToDB = ref(database, 'food')

const inputEl = document.querySelector('.add-item #input-field')
const quantityEl = document.querySelector('.add-item #quantity')
const bBeforeEl = document.querySelector('.add-item #b-before')
const typeEl = document.querySelector('.add-item #type-list')

const dateEl = document.querySelector('.item-list .date')
const itemEl = document.querySelector('.item-list .item-info')
const locationEl = document.querySelector('.item-list .item-location')


const itemList = document.querySelector('.container-list')

const addBtn = document.querySelector('.buttons .add')



let itemArray = []

function addItem(){
   const inputValue = inputEl.value
   const quantityValue = quantityEl.value
   const bBeforeValue = bBeforeEl.value
   const typeValue = typeEl.value
   
   if(inputValue === ""){
    alert("please enter item")
   }else{
    itemArray.push(inputValue, quantityValue, bBeforeValue, typeValue)
    push(refFoodToDB, itemArray)
 
    resetInput()
   }
}

function resetInput(){
    inputEl.value = ""
    quantityEl.value = ""
    bBeforeEl.value = ""
    typeEl.value = ""

    itemArray = []
}

function appendItem(item){
    let [itemID, itemValue] = item
    
    itemList.innerHTML += `
            <div class="item-list">
                <div class="date">
                    <h3>Best before</h3>
                    <p>${dateEl.innerHTML = itemValue[2]}</p>
                </div>
                
                <div class="item-info">
                    <h3>Item</h3>
                    <p>${itemEl.innerHTML = `${itemValue[1]}, ${itemValue[0]}`}</p>
                </div>
                <div>
                    <button>x</button>
                    <div>
            </div>
        `

    const delBtn = document.querySelector('.item-list button')
    delBtn.addEventListener('click', function (){
        const itemExactLocationInDB = ref(database, `food/${itemID}`)

        remove(itemExactLocationInDB)

        
    })
}

function clearDB(){
    itemList.innerHTML = ""
}

onValue(refFoodToDB, function(snapshot){
    if(snapshot.exists()){
        const foodArray = Object.entries(snapshot.val())

        clearDB()
        for (let i of foodArray){
            let currentItem = i
            let [currentItemID, currentItemArrayofValues] = currentItem
            appendItem(currentItem);
        }
    }else{
        itemList.innerHTML = `<p>Not items added yet</p>`
    }

})

addBtn.addEventListener('click', addItem)
