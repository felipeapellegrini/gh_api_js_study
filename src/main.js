import api from './api'; // importing variable with API base url

class App {
    constructor() {

        // this array will store the github repository search results 
        this.repositories = [];

        // grabbing the html elements
        this.formEl = document.getElementById('repo-form');
        this.inputEl = document.querySelector('input[name=repository]');
        this.listEl = document.getElementById('repo-list');

        // calling the function that handle the registers
        this.registerHandlers();
    }

    // this function listens to the submit event and passes it to the addRepository 
    registerHandlers() {
        this.formEl.onsubmit = (event) => this.addRepository(event);
    }

    // this function will create a loading element
    setLoading(loading = true) {
        if (loading === true) { // checks if the request is loading
            let loadingEl = document.createElement('span'); // create a new html element to display
            loadingEl.appendChild(document.createTextNode('Loading')); // put the 'Loading' text into the element
            loadingEl.setAttribute('id', 'loading'); // set the element's id so I can grab it later

            this.formEl.appendChild(loadingEl); // append the loading element to the form element
        } else {
            document.getElementById('loading').remove(); // remove the loading element if the request isn't loading
        }
    }

    // this function will add a repository to the repo's array
    async addRepository(event) {
        event.preventDefault(); // preventing the form's usual behavior (reload the page)

        const repoInput = this.inputEl.value; // variable to store the text typed by the user

        if (repoInput.lenght === 0){
            return; // checks if the user missclicked on submit and prevents the page to load
        }

        this.setLoading(); // calling the loading element

        // the code below is responsible of getting the api's result and show in screen
        try {
            const response = await api.get(`/repos/${repoInput}`);
    
            // here I destructure the response object in order to get just the data I want to show
            const { name, description, html_url, owner: { avatar_url } } = response.data;
    
            // pushing the results into the array
            this.repositories.push({
                name,
                description,
                avatar_url,
                html_url
            });
    
            // clearing the form text
            this.inputEl.value = '';
    
            // calling renderization
            this.render()
        } catch (err) {
            // catching possible errors and warning the user
            alert('Repository not found!');
            this.inputEl.value = '';
        }

        // removing the loading element
        this.setLoading(false);
    }

    // the method below will render the objects into the screen
    render() {
        // clearing the list element
        this.listEl.innerHTML = '';

        // going through the repo's array, creating/setting the elements and appending them to a list element
        this.repositories.forEach(repo => {
            let imgEl = document.createElement('img');
            imgEl.setAttribute('src', repo.avatar_url);

            let titleEl = document.createElement('strong');
            titleEl.appendChild(document.createTextNode(repo.name));

            let descriptionEl = document.createElement('p');
            descriptionEl.appendChild(document.createTextNode(repo.description));

            let urlEl = document.createElement('a');
            urlEl.setAttribute('href', repo.html_url);
            urlEl.setAttribute('target', '_blank');
            urlEl.appendChild(document.createTextNode('Acessar'));

            let listItemEl = document.createElement('li');
            listItemEl.appendChild(imgEl);
            listItemEl.appendChild(titleEl);
            listItemEl.appendChild(descriptionEl);
            listItemEl.appendChild(urlEl);

            this.listEl.appendChild(listItemEl);
        });
    }
}
// instancing the application
new App();