// Storage Controller

//Item Controller
const ItemCtrl = (function() {
  // Item constructor
  const Item = function(id, name, calroies) {
    this.id = id;
    this.name = name;
    this.calroies = calroies;
  };
  // Data structure /State
  const data = {
    items: [
      //   { id: 0, name: "Steak Dinner", calroies: 1200 },
      //   { id: 1, name: "Cookies", calroies: 400 },
      //   { id: 2, name: "Eggs", calroies: 300 }
    ],
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
    logData: function() {
      return data;
    }
  };
})();

//UI Controller
const UICtrl = (function() {
  const UISelector = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories"
  };
  // Public Methods
  return {
    populateItemList: function(items) {
      let html = "";
      items.forEach(function(item) {
        html += `<li class="collection-item" id="item-${item.id}">
            <Strong>${item.name}:</Strong><em>${item.calroies} Calories</em>
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
        item.calroies
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
    clearInput: function() {
      document.querySelector(UISelector.itemNameInput).value = "";
      document.querySelector(UISelector.itemCaloriesInput).value = "";
    },
    hideList: function() {
      document.querySelector(UISelector.itemList).style.display = "none";
    },
    getSelectors: function() {
      return UISelector;
    }
  };
})();

//App Controller

const App = (function(ItemCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    //   Get UI Selectors
    const UISelector = UICtrl.getSelectors();
    // Add Item event
    document
      .querySelector(UISelector.addBtn)
      .addEventListener("click", itemAddSubmit);
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

      // Clear field
      UICtrl.clearInput();
    }
    e.preventDefault();
  };
  // Public Methods
  return {
    init: function() {
      console.log("Initializing app");
      //   fetch item from data structure
      const items = ItemCtrl.getItem();
      // check if any item
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }

      // load event listener
      loadEventListeners();
    }
  };
})(ItemCtrl, UICtrl);

App.init();
