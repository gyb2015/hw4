/*
Menu.js -- Dawg Pizza menu in a convenient data structure
Include this script in your page to automatically define a
'com.dawgpizza.menu' global variable containing the Dawg Pizza menu.
The data is arranged in an object tree (see below for structure).
Use this to build your user interface, as
well as maintain what is in the shopping cart.

Author: D Stearns
*/

/*
Tip: since JavaScript doesn't really have module-level variables,
modules like this have to define global ones instead. But since the
global namespace is flat, we have to be careful not to stomp on 
variabes of the same name defined by other modules the developer
might be using. A common technique for this is to use a namespace,
which in JavaScript is an object hierarchy where the names match
your domain name in reverse order--in this case com.dawgpizza.<var>

The trick is to allow other modules to also define com.<whatever>,
or define a different variable name with in com.dawgpizza. To allow
that, we build it up, piece by piece, using anything that is already
defined, until we get to our variable.
*/

//use existing 'com' if defined
var com = com || {};

//use existing 'com.dawgpizza' if defined
com.dawgpizza = com.dawgpizza || {};

//our menu object
com.dawgpizza.menu = {
    pizzas: [
        {
            type: 'pizza',
            name: 'Classic Pepperoni',
            description: 'Pepperoni and Mozzarella on our Spicy Tomato Sauce',
            prices: [10,13,16]
        },
        {
            type: 'pizza',
            name: 'The Hawaiian',
            description: 'Canadian Bacon and Pineapple with Mozzarella on a rich Tomato Sauce',
            prices: [12,14,17]
        },
        {
            type: 'pizza',
            name: 'Duck, Duck, Goose',
            description: 'Roasted Duck and Goose with Bacon, Chestnuts on a rich Plum Sauce',
            prices: [15,17,19]
        },
        {
            type: 'pizza',
            name: 'The Bambi',
            description: 'Slow-cooked Venison with Red Cabbage on our famous Black Cherry Sauce',
            prices: [15,17,19]
        },
        {
            type: 'pizza',
            name: 'The Ultimate',
            description: 'Pepperoni, Bacon, Canadian Bacon, Chicken, Duck, Goose, and Ground Beef with Smoked Mozzarella on our Spicy Tomato Sauce',
            prices: [15,19,23]
        },
        {
            type: 'pizza',
            name: 'Margherita',
            description: 'Mozzarella, Basil, Salt on an Olive Oil Base',
            prices: [10,13,16],
            vegetarian: true
        },
        {
            type: 'pizza',
            name: 'Veggie Madness',
            description: 'Mushroom, Black Olive, Onions, Roasted Garlic, Squash and Roasted Eggplant on our Spicy Tomato Sauce',
            prices: [11,14,17],
            vegetarian: true
        },
        {
            type: 'pizza',
            name: 'Forest Floor',
            description: 'Three kinds of mushrooms with Mozzarella on a herb Tomato Sauce',
            prices: [11,14,17],
            vegetarian: true
        },
        {
            type: 'pizza',
            name: 'Mr Green',
            description: 'Roasted Chicken with Romano on a Basil Pesto sauce',
            prices: [13,16,19],
            vegetarian: true

        },
        {
            type: 'pizza',
            name: 'Purple Monster',
            description: 'Roasted Eggplant and Cabbage stir fried in sesame oil on a rich Plum Sauce',
            prices: [11,14,17],
            vegetarian: true
        }
    ],

    drinks: [
        {
            type: 'drink',
            name: 'Coke',
            price: 4
        },
        {
            type: 'drink',
            name: 'Diet Coke',
            price: 4
        },
        {
            type: 'drink',
            name: 'Sprite',
            price: 4
        },
        {
            type: 'drink',
            name: 'Root Beer',
            price: 4
        },
        {
            type: 'drink',
            name: 'Irn Bru',
            price: 4
        }
    ],

    desserts: [
        {
            type: 'dessert',
            name: 'Chocolate Gelato',
            price: 8
        },
        {
            type: 'dessert',
            name: 'Lemon Sorbet',
            price: 7
        },
        {
            type: 'dessert',
            name: 'Ricotta Cheese Cake',
            price: 10
        }
    ]
};

//categories with captions you can use if you want to.
//these might be displayed as section headers
//or as tabs for viewing one category at a time.
com.dawgpizza.menuCategories = [
    {
        caption: 'Pizzas',
        items: com.dawgpizza.menu.pizzas
    },
    {
        caption: 'Drinks',
        items: com.dawgpizza.menu.drinks
    },
    {
        caption: 'Desserts',
        items: com.dawgpizza.menu.desserts
    }
];
