var eventBus = new Vue()

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">
            <div class="product-image">
                <img v-bind:src="image" v-bind:title="altText"/>
            </div>
            <div class="product-info">
                <h1>{{ title }}</h1>
                <p v-if="onSale">It's on sale! Yay!</p>
                <p v-else>Out of sale</p>
                <p>User is <span v-if="premium">premium</span><span v-else>not premium</span>

                <product-detail :details="details"></product-detail>

                <div class="color-box"
                    v-for="(variant, index) in variants" 
                    :key="variant.variantId"
                    :style="{ backgroundColor: variant.color }"
                    @mouseover="updateProduct(index)">
            
                </div>

                <!-- v-on:click="cart += 1" -->
                <button v-on:click="addToCart" 
                    :disabled="!onSale"
                    :class="{ disabledButton: !onSale }">Add to cart
                </button>

                <p :hidden="onSale" :class="{ outOfSale: !onSale }">Out of sale</p>

                <button @click="decrementCart">Remove from cart</button>

                <product-tabs :reviews="reviews" :shipping="shipping"></product-tabs>
            </div>
        </div>
    `,
    data() {
        return {
            brand: 'Vue Mastery',
            product: 'Socks',
            selectedVariant: 0,
            //image: './assets/socks.jpg',
            altText: 'a pair of socks',
            onSale: true,
            details: ["%80 cotton", "%20 polyester", "gender neutral"],
            variants: [{
                    variantId: 1234,
                    color: "blue",
                    image: "./assets/blueSocks.jpg"
                },
                {
                    variantId: 2345,
                    color: "green",
                    image: "./assets/socks.jpg"
                }
            ],
            cart: 0,
            reviews: []
        }
    },
    methods: {
        addToCart: function() {
            //this.cart += 1
            this.$emit('add-to-cart')
        },
        decrementCart: function() {
            this.$emit('remove-from-cart')
        },
        updateProduct: function(index) {
            this.selectedVariant = index
            console.log(index)
        },
        updateProductColor: function(variantImage) {
            this.image = variantImage
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].image
        },
        shipping() {
            if (this.premium) {
                return "free"
            } else {
                return 5.99
            }
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})

Vue.component('product-detail', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <div>
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
        </div>
    `
})

Vue.component('product-review', {
    props: {

    }, template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name" required></input>
            </p>
            <p>
                <label for="review">Review:</label>
                <textarea id="review" v-model="review" required></textarea>
            </p>
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating" required>
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                    <option>0</option>
                </select>
            </p>
            <p>
                <label>Would you recommend this product?</label><br>
                <input id="wouldya1" name="picked" type="radio" value="true" v-model="recommended"></input>
                <label for="wouldya1">Yes</label>
                <input id="wouldya2" name="picked" type="radio" value="false" v-model="recommended"></input><br>
                <label for="wouldya2">No</label>
                <span>You picked {{ this.recommended }}</span>
            </p>
            <p>
                <input type="submit" value="Submit"></input>
            </p>
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommended: false
        }
    },
    methods: {
        onSubmit(name, review, rating) {
            let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating,
                recommended: this.recommended
            }

            //this.$emit('review-submitted', productReview)
            eventBus.$emit('review-submitted', productReview)

            // need to refresh these values after submit
            this.name = null
            this.review = null
            this.rating = null
        }
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        },
        shipping: {
            type: Number,
            required: true
        }
    },
    template: `
        <div>
            <div>
                <span :class="{ activeTab: selectedTab === tab }" v-for="(tab,index) in tabs" 
                        @click="selectedTab=tab">{{ tab }}</span>
            </div>
            <div v-show="selectedTab === 'Reviews'">
                <p v-if="!reviews.length">There are no reviews yet. Do you want to make the first review?</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>Rating: {{ review.review }}</p>
                        <p>Review: {{ review.rating }}</p>
                        <p v-if="review.recommended=='true'">This user recommends this prpduct</p>
                        <p v-if="review.recommended=='false'">This user does not recommend this product</p>
                    </li>
                </ul>
            </div>

            <div v-show="selectedTab === 'Make a Review'">
              <product-review></product-review>        
            </div>

            <div v-show="selectedTab === 'Shipment'">
                <p>Shipping for this product will be {{ shipping }}</p>
            </div>
        </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipment'],
            selectedTab: 'Reviews'
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        link: 'https://www.rapidtables.com/web/html/link/html-anchor-link.html',
        //details: ["%80 cotton", "%20 polyester", "gender neutral"],
        cart: 0
    },
    methods: {
        updateCart() {
            this.cart += 1
        },
        removeFromCart() {
            if (this.cart > 0) {
                this.cart -= 1
            }
        }
    }
})