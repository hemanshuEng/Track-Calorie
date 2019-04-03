// Storage Controller
const StorageCtrl = (function() {
  //public method
  return {
    storeItem: function(item) {
      let items ;
      //check if any items in ls
      if (localStorage.getItem("items") === null) {
        items = [];
        //push newitem
        items.push(item);
        //set ls
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        //push new item
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemFromStorage:function(){
        let items=[];
        if(localStorage.getItem('items')===null){
            items=[];
        }else{
            items =JSON.parse(localStorage.getItem('items'));
        }
        return items;
    }
  };
})();

//Item Controller
const ItemCtrl = (function() {
  // Item constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  // Data structure /State
  const data = {
    // items: [
    //   //   { id: 0, name: "Steak Dinner", calories: 1200 },
    //   //   { id: 1, name: "Cookies", calories: 400 },
    //   //   { id: 2, name: "Eggs", calories: 300 }
    // ],
    items: StorageCtrl.getItemFromStorage(),
    currentItem: null,
    totalCalories: 0
  };
  // Public Methods
  return {
    getItem: function() {
      return data.items;
    },
    addItem: function(name, calorie) {
      let ID;
      // create id
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      //Calories to number
      const calories = parseInt(calorie);
      //create new item
      newItem = new Item(ID, name, calories);
      // add to item array
      data.items.push(newItem);
      return newItem;
    },
    getItemById: function(id) {
      let found = null;
      // loop througn to item
      data.items.forEach(function(item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories) {
      // calories to number
      calories = parseInt(calories);
      let found = null;
      data.items.forEach(function(item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id) {
      // Get ids
      const ids = data.items.map(function(item) {
        return item.id;
      });
      // Get index
      const index = ids.indexOf(id);
      // remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function() {
      data.items = [];
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getTotalCalories: function() {
      let total = 0;
      data.items.forEach(function(item) {
        total += item.calories;
      });

      // set total
      data.totalCalories = total;
      return data.totalCalories;
    },
    logData: function() {
      return data;
    }
  };
})();

//UI Controller
const UICtrl = (function() {
  const UISelector = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories"
  };
  // Public Methods
  return {
    populateItemList: function(items) {
      let html = "";
      items.forEach(function(item) {
        html += `<li class="collection-item" id="item-${item.id}">
            <Strong>${item.name}:</Strong><em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fas fa-pencil-alt    "></i>
            </a>
          </li>`;
      });
      // insert list item
      document.querySelector(UISelector.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelector.itemNameInput).value,
        calroies: document.querySelector(UISelector.itemCaloriesInput).value
      };
    },
    addListItem: function(item) {
      document.querySelector(UISelector.itemList).style.display = "block";
      //Create li element

      const li = document.createElement("li");
      li.className = "collection-item";
      // add ID
      li.id = `item-${item.id}`;
      // add html
      li.innerHTML = `<Strong>${item.name}:</Strong><em>${
        item.calories
      } Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fas fa-pencil-alt    "></i>
        </a>`;
      //   debugger;
      // insert item
      document
        .querySelector(UISelector.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelector.listItems);
      //turn node list into array
      listItems = Array.from(listItems);
      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute("id");
        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<Strong>${
            item.name
          }:</Strong><em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fas fa-pencil-alt    "></i>
                </a>`;
        }
      });
    },
    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function() {
      document.querySelector(UISelector.itemNameInput).value = "";
      document.querySelector(UISelector.itemCaloriesInput).value = "";
    },
    addItemToForm: function() {
      document.querySelector(
        UISelector.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelector.itemCaloriesInput
      ).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: function() {
      let listItems = document.querySelectorAll(UISelector.listItems);

      // Turn Node list into array
      listItems = Array.from(listItems);
      listItems.forEach(function(item) {
        item.remove();
      });
    },
    hideList: function() {
      document.querySelector(UISelector.itemList).style.display = "none";
    },
    showTotalCalories: function(total) {
      document.querySelector(UISelector.totalCalories).textContent = total;
    },
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelector.updateBtn).style.display = "none";
      document.querySelector(UISelector.deleteBtn).style.display = "none";
      document.querySelector(UISelector.updateBtn).style.display = "none";
      document.querySelector(UISelector.backBtn).style.display = "none";
      document.querySelector(UISelector.addBtn).style.display = "inline";
    },
    showEditState: function() {
      document.querySelector(UISelector.updateBtn).style.display = "inline";
      document.querySelector(UISelector.deleteBtn).style.display = "inline";
      document.querySelector(UISelector.backBtn).style.display = "inline";
      document.querySelector(UISelector.addBtn).style.display = "none";
    },
    getSelectors: function() {
      return UISelector;
    }
  };
})();

//App Controller

const App = (function(ItemCtrl, UICtrl, StorageCtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    //   Get UI Selectors
    const UISelector = UICtrl.getSelectors();
    // Add Item event
    document
      .querySelector(UISelector.addBtn)
      .addEventListener("click", itemAddSubmit);
    //   disable submit on enter
    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
    document
      .querySelector(UISelector.itemList)
      .addEventListener("click", itemEditClick);

    // update item
    document
      .querySelector(UISelector.updateBtn)
      .addEventListener("click", itemUpdateSubmit);
    // Back button item
    document
      .querySelector(UISelector.backBtn)
      .addEventListener("click", UICtrl.clearEditState);
    // Back button item
    document
      .querySelector(UISelector.deleteBtn)
      .addEventListener("click", ItemDeleteSubmit);
    // clear button
    document
      .querySelector(UISelector.clearBtn)
      .addEventListener("click", clearAllItemsClick);
  };
  //   Add item submit
  const itemAddSubmit = function(e) {
    //Get Form input form uictrl
    const input = UICtrl.getItemInput();

    // chekc for name and calorie input
    if (input.name !== "" && input.calroies !== "") {
      // add item
      const newItem = ItemCtrl.addItem(input.name, input.calroies);

      //   add item to ui list
      UICtrl.addListItem(newItem);
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
      // store in localStorage
      StorageCtrl.storeItem(newItem);
      // Clear field
      UICtrl.clearInput();
    }
    e.preventDefault();
  };
  //   Click edit item
  const itemEditClick = function(e) {
    if (e.target.classList.contains("edit-item")) {
      //Get list item id (item-0)
      const listId = e.target.parentNode.parentNode.id;
      // break into an array
      const listIdArr = listId.split("-");
      // get the acutal id
      const id = parseInt(listIdArr[1]);

      //   get item
      const itemToEdit = ItemCtrl.getItemById(id);
      //   set that current item
      ItemCtrl.setCurrentItem(itemToEdit);
      //   add item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  };
  //   item update submit
  const itemUpdateSubmit = function(e) {
    // get item input
    const input = UICtrl.getItemInput();
    // update item
    const updateItem = ItemCtrl.updateItem(input.name, input.calroies);
    // update UI
    UICtrl.updateListItem(updateItem);

    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();
    e.preventDefault();
  };
  //Delete Button Event
  const ItemDeleteSubmit = function(e) {
    // get Current item id
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from items
    ItemCtrl.deleteItem(currentItem.id);
    // Delete from ui
    UICtrl.deleteListItem(currentItem.id);
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();
    e.preventDefault();
  };

  // clear item events
  const clearAllItemsClick = function() {
    //   Delete all items from data structure
    ItemCtrl.clearAllItems();

    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.removeItems();
    //hide ul
    UICtrl.hideList();
  };
  // Public Methods
  return {
    init: function() {
      console.log("Initializing app");
      //   clear edit state
      UICtrl.clearEditState();
      //   fetch item from data structure
      const items = ItemCtrl.getItem();
      // check if any item
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
      // load event listener
      loadEventListeners();
    }
  };
})(ItemCtrl, UICtrl, StorageCtrl);

App.init();
