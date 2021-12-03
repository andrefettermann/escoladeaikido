const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const oid = urlParams.get('oid');

function loadPeople() {
    // clear the tab
    const tab = document.querySelector("#pessoas");
    tab.innerHTML = "";

    //load people
    fetch('http://localhost:5000/api/pessoas/' + oid).then(async function (response) {
        response.json().then(function (doc) {
            const records_found = document.createElement("h3");
            tab.appendChild(records_found);

            var people = [];
            doc.docs.forEach(person => {
                fetch('http://localhost:5000/api/criptografia/' + person.nome).then(async function (response) {
                    response.json().then(function (r) {
                        //element.textContent = doc.decripted;
                        person.nome = r.decripted;
                    });
                });
                people.push(person);
            });

            const ul = document.createElement('ol');
            people.forEach(value => {
                console.log(value.nome);
                const li = document.createElement('li');

                const a = document.createElement('a');
                a.href = "pessoa.html?pid=" + value.id;
                a.textContent = value.nome;

                const birthday = document.createElement('p');
                birthday.textContent = value.aniversario;
                a.appendChild(birthday);
                li.appendChild(a);
                ul.appendChild(li);
            });
            tab.appendChild(ul);

            records_found.textContent = people.length + " carregados às "
                + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        });
    });
}

function loadDojos() {
    // clear the tab
    const dojosTab = document.querySelector("#dojos");
    dojosTab.innerHTML = "";

    //load dojos
    fetch('http://localhost:5000/api/dojos/' + oid).then(async function (response) {
        response.json().then(function (doc) {
            const records_found = document.createElement("h3");
            dojosTab.appendChild(records_found);

            const ul = document.createElement('ol');
            doc.docs.forEach(function (dojo) {
                const li = document.createElement('li');

                const a = document.createElement('a');
                a.href = 'dojo.html?did=' + dojo._id;
                a.textContent = dojo.nome;
                li.appendChild(a);
                ul.appendChild(li);
            });
            dojosTab.appendChild(ul);

            records_found.textContent = doc.docs.length + " carregados às "
                + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        });
    });
}

function deleteOrganization() {
    /*
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const oid = urlParams.get('oid');
*/
    const confirm = window.confirm('Tem certeza que deseja excluir?');
    if (confirm) {
        const url = 'http://localhost:5000/api/organizacao/' + oid;
        var messages = document.querySelector("#messages");
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        }).then(response => {
            window.location.replace("index.html");
        }).catch(function (err) {
            console.error('Failed retrieving information', err);
            messages.textContent = err;
        });
    }
}

function loadOrganization() {
    var title = document.querySelector("title");
    const h2 = document.querySelector('#organization-name');
    const span = document.querySelector('#organization-details');

    fetch('http://localhost:5000/api/organizacao/' + oid).then(async function (response) {
        response.json().then(function (doc) {
            title.textContent += " - " + doc.nome;
            h2.textContent = doc.nome;

            const responsible = document.createElement("p");
            responsible.textContent = doc.responsavel;
            span.appendChild(responsible);

            const email = document.createElement("p");
            email.textContent = doc.email;
            span.appendChild(email);

            const site = document.createElement("p");
            const url = document.createElement("a");
            url.textContent = doc.url;
            url.href = doc.url;
            site.appendChild(url);

            span.appendChild(site);
        });
    });

}

function loadOrganizations() {
    // Obtain the root 
    const rootElement = document.querySelector('#root');

    fetch('http://localhost:5000/api/organizacoes').then(async function (response) {
        response.json().then(function (doc) {
            const ul = document.createElement('ol');
            doc.docs.forEach(function (org) {
                const li = document.createElement('li');

                const a = document.createElement('a');
                a.href = 'organizacao.html?oid=' + org._id;
                a.textContent = org.nome;
                li.appendChild(a);
                ul.appendChild(li);
            });
            console.log(ul);
            rootElement.appendChild(ul);

            const records_found = document.querySelector('#records-found');
            records_found.textContent = doc.docs.length + " carregados às "
                + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

        });
    });
}

function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    if (tabName == "dojos") {
        loadDojos();
    } else if (tabName = "pessoas") {
        loadPeople();
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

}
