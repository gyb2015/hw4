// global variables
var subtotal = 0;
var tax = 0;
var total = 0;
var cartCookie = null;

var fillInMenu = function (templateClassName, menuArray, isPizza) {
    var template = $(templateClassName);
    var templateContainerName = templateClassName + '-container';
    var container = $(templateContainerName);
    var btn;
    
    $.each(menuArray, function() {
        var $instance = template.clone();
        $instance.find('.name').html(this.name);
        if (isPizza) {
            $instance.find('.description').html(this.description);
            
            // small size
            btn = $instance.find('.size-small');
            btn.find('.price').html('Small: $' + this.prices[0]);
            btn.attr({
                'data-name': this.name,
                'data-price': this.prices[0]
            });
            btn.show();
            
            // medium size
            btn = $instance.find('.size-medium');
            btn.find('.price').html('Medium: $' + this.prices[1]);
            btn.attr({
                'data-name': this.name,
                'data-price': this.prices[1]
            });
            btn.show();
            
            // large size
            btn = $instance.find('.size-large');
            btn.find('.price').html('Large: $' + this.prices[2]);
            btn.attr({
                'data-name': this.name,
                'data-price': this.prices[2]
            });
            btn.show();
        }
        else {
            btn = $instance.find('button');
            btn.find('.price').html('Price: $' + this.price);
            btn.attr({
                'data-name': this.name,
                'data-price': this.price
            });
            btn.show();
        }
        
        container.append($instance);
    });
}

$(function(){ 
    //create a cart model as a simple object with
    //the properties we eventually need to post to
    //the server
    var cart = {
        name: null,
        address1: null,
        zip: null,
        phone: null,
        items: [] //empty array
    }; //cart data

    //generate menu
    fillInMenu('.template-pizzas', com.dawgpizza.menu.pizzas, true);
    fillInMenu('.template-drinks', com.dawgpizza.menu.drinks, false);
    fillInMenu('.template-desserts', com.dawgpizza.menu.desserts, false);

    //retrieve contact info from cookie
    retrieveContact();

    //click event handler for all buttons with the
    //style class 'add-to-cart'
    $('.add-to-cart').click(function(){
        //use the attributes on the button to construct
        //a new cart item object that we can add to the
        //cart's items array
        var newCartItem = {
            type: this.getAttribute('data-type'),
            name: this.getAttribute('data-name'),
            size: this.getAttribute('data-size'),
            price: this.getAttribute('data-price')
        };

        //push the new item on to the items array
        cart.items.push(newCartItem);

        //render the cart's contents to the element
        //we're using to contain the cart information
        //note that you would need a <div> or some
        //other grouping element on the page that has a
        //style class of 'cart-container'
        renderCart(cart, $('.cart-container'));
    });
    
    $('.place-order').click(function(){
        //validate the cart to make sure all the required
        //properties have been filled out, and that the 
        //total order is greater than $20 (see homework 
        //instructions) 
        var warning = $('.warning');
        var goodToPost = true;
        
        if (subtotal < 20) {
            warning.html("Total order must be at least $20.");
            goodToPost = false;
        }
        else if ($.trim($('#name').val()) === '') {
            warning.html("Name field cannot be empty.");
            goodToPost = false;
        }
        else if ($.trim($('#address1').val()) === '') {
            warning.html("Address1 field cannot be empty.");
            goodToPost = false;
        }
        else if ($.trim($('#zip').val()) === '') {
            warning.html("Zip field cannot be empty.");
            goodToPost = false;
        }
        else if ($.trim($('#phone').val()) === '') {
            warning.html("Phone field cannot be empty.");
            goodToPost = false;
        }
        
        if (goodToPost) {
            warning.hide();
            
            cart.name = $.trim($('#name').val());
            cart.address1 = $.trim($('#address1').val());
            cart.zip = $.trim($('#zip').val());
            cart.phone = $.trim($('#phone').val());
            if ($.trim($('#address2').val()) !== '') {
                cart.address2 = $.trim($('#address2').val());
            }
            
            postCart(cart, $('.cart-form'));
        }
        else {
            warning.show();
        }
    });

    $('.start-over').click(function(){
        cart.items = [];
        $('.warning').hide();
        renderCart(cart, $('.cart-container'));
    });

    $('.retrieve-last-order').click(function(){
        if (cartCookie != null) {
            cart.items = cartCookie.items;
            renderCart(cart, $('.cart-container'));
        }
    });
}); //doc ready


// renderCart()
// renders the current cart information to the screen
// parameters are:
//  - cart (object) reference to the cart model
//  - container (jQuery object) reference to the container <div>
//
function renderCart(cart, container) {
    var idx, item;
    var templateCartItem, clonedCartItem;
    
    //empty the container of whatever is there currently
    container.empty();
    subtotal = 0;
    tax = 0;
    total = 0;
    
    templateCartItem = $('.template-cart-container');

    //for each item in the cart...
    for (idx = 0; idx < cart.items.length; ++idx) {
        item = cart.items[idx];

        //code to render the cart item
        clonedCartItem = templateCartItem.clone();
        if (item.type == "pizza") {
            clonedCartItem.find('.item-name').html(item.name + ' (' + item.size + ')');
        }
        else {
            clonedCartItem.find('.item-name').html(item.name);
        }
        clonedCartItem.find('.item-price').html(item.price);
        
        clonedCartItem.find('.remove-item').attr({
            'data-idx': idx
        });

        clonedCartItem.find('.remove-item').click(function () {
            var idx = this.getAttribute('data-idx');

            //remove item and re-render the cart container
            cart.items.splice(idx, 1);
            renderCart(cart, $('.cart-container'));
        });

        clonedCartItem.show();
        
        container.append(clonedCartItem);

        subtotal += parseInt(item.price);
    } //for each cart item

    //code to render sub-total price of the cart
    $('.subtotal-price').html(subtotal);
    
    //the tax amount (see instructions), 
    tax = subtotal * 0.095;
    $('.tax-price').html(tax);
    
    //and the grand total
    total = subtotal + tax;
    $('.total-price').html(total);
} //renderCart()

// postCart()
// posts the cart model to the server using
// the supplied HTML form
// parameters are:
//  - cart (object) reference to the cart model
//  - cartForm (jQuery object) reference to the HTML form
//
function postCart(cart, cartForm) {
    var stringifiedCart = JSON.stringify(cart);

    //find the input in the form that has the name of 'cart'    
    //and set it's value to a JSON representation of the cart model
    cartForm.find('input[name="cart"]').val(stringifiedCart);

    //store the cart to cookie before submitting the order
    document.cookie="cart="+escape(stringifiedCart);

    //submit the form--this will navigate to an order confirmation page
    cartForm.submit();

} //postCart()

function retrieveContact() {
    var cookie = document.cookie;
    var start = cookie.indexOf("cart=");
    var end = 0;

    //get the stringified cart string from cookie
    if (start != -1) {
        start = cookie.indexOf("=", start) + 1;
        end = cookie.indexOf(";", start);
        if (end == -1) {
            end = cookie.length;
        }
        
        //convert the string to object
        cartCookie = JSON.parse(unescape(cookie.substring(start, end)));

        if (cartCookie != null) {
            //assign contact info to text fields
            if (cartCookie.name != null) {
                $('#name').val(cartCookie.name);
            }
            if (cartCookie.address1 != null) {
                $('#address1').val(cartCookie.address1);
            }
            if (cartCookie.address2 != null) {
                $('#address2').val(cartCookie.address2);
            }
            if (cartCookie.zip != null) {
                $('#zip').val(cartCookie.zip);
            }
            if (cartCookie.phone != null) {
                $('#phone').val(cartCookie.phone);
            }
        }
    }
}
