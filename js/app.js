var app = new Vue({
    // el: the DOM element to be replaced with a Vue instance
    el: '#app',

    // data: all the data for the app
    data: {
        searching: true,
        searchTerm: '🐝',
        searchResults: new BookCollection(),
        books: new BookCollection(),
        bookmarks: new BookCollection(),
        favorites: new BookCollection(),
        bookshelf: 'store',
    },

    // methods: usually "events" triggered by v-on:
    methods: {
        // change "page" by setting books array
        display(bookshelf) {
            this.bookshelf = bookshelf;

            switch (this.bookshelf) {
                case 'store':
                    this.books = this.searchResults;
                    break;
                case 'bookmarks':
                    this.books = this.bookmarks;
                    break;
                case 'favorites':
                    this.books = this.favorites;
                    break;
            }
        },

        // LOAD BOOKS
        searchBooks() {
            // prepare and perform search
            if (this.searchTerm) {
                // clear results
                this.searchResults = new BookCollection();

                // display message
                this.searching = true;


                let url = 'https://www.googleapis.com/books/v1/volumes';

                let config = {
                    params: {
                        q: this.searchTerm,
                        maxResults: 36,
                        filter: 'partial',
                    },
                    responseType: 'json',
                    // headers: ..
                }

                axios.get(url, config)
                    .then(response => {
                        console.log('api response', response);

                        // set results array
                        if (response.data.items.length > 0) {
                            // decorate the generic array returned from google
                            this.searchResults = new BookCollection(response.data.items)
                            // or without a custom model
                            // this.searchResults = response.data.items
                        } else {
                            this.searchResults = new BookCollection();
                        }
                    })
                    .catch(error => {
                        // a bad search term / internet connection or you hit quota limit
                        console.log('AJAX SEARCH ERROR', error)
                    })
                    .finally(() => {
                        // remove loading screen
                        this.searching = false;

                        // redirect to "store" page
                        this.display('store');
                    })
                // build request arguments

                // TODO: build ajax request arguments

                // execute ajax request using promises

                // TODO: write ajax request

            }
        },
    },

    // computed: values that are updated and cached if dependencies change
    computed: {},

    //mounted:  called after the instance has been mounted,
    mounted: function () {
        // if we have a list in local storage, replace the sample data
        if (localStorage.getItem('bookmarks')) {
            this.bookmarks = new BookCollection(JSON.parse(localStorage.getItem('bookmarks')));
        }

        if (localStorage.getItem('favorites')) {
            this.favorites = new BookCollection(JSON.parse(localStorage.getItem('favorites')));
        }

        // perform default search
        this.searchBooks();
    },

    // watch: calls the function if the value changes
    // https://travishorn.com/add-localstorage-to-your-vue-app-in-2-lines-of-code-56eb2c9f371b
    watch: {
        bookmarks: {
            handler: function (newCollection) {
                // store in local storage for later
                localStorage.setItem('bookmarks', JSON.stringify(newCollection));
            }
        },
        favorites: {
            handler: function (newCollection) {
                // store in local storage for later
                localStorage.setItem('favorites', JSON.stringify(newCollection));
            }
        }
    }
});
