console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// // Update current page 
// let navLinks = $$("nav a");

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
// );

// currentLink?.classList.add('current');


// Create Navigation Bar (make root relative)
let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'resume/', title: 'Resume' },
    { url: 'contact/', title: 'Contact' },
    { url: 'meta/', title: 'Meta' },
    { url: 'https://github.com/dklopstein', title: 'GitHub'}
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    
    // Create link and add it to nav
    const ARE_WE_HOME = document.documentElement.classList.contains('home');
    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
    // nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);
    
    // Add current class to show highlight for current page
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }

    if (a.host != location.host) {
        a.setAttribute('target', '_blank');
    }
};

// Create Color Scheme Options
document.body.insertAdjacentHTML(
    'afterbegin',
    `
      <label class="color-scheme">
          Theme:
          <select>
            <option value="light dark"></option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
      </label>`
);

let userTheme = matchMedia("(prefers-color-scheme: dark)").matches ? 'Automatic (Dark)' : 'Automatic (Light)';
let select = document.querySelector('select');
select.options[0].insertAdjacentHTML('afterbegin', userTheme);

select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value
});

window.addEventListener("load", (event) => {
    if (localStorage.colorScheme) {
        select.value = localStorage.colorScheme;
        document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
    }
});

// Projects Functions
export async function fetchJSON(url) {
    try {
        // Fetch the JSON file from the given URL
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }

        console.log(response)
        const data = await response.json();
        return data; 


    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}

export function renderProjects(project, containerElement, headingLevel = 'h2') {
    containerElement.innerHTML = '';
    for (let p of project) {
        const article = document.createElement('article');
        article.innerHTML = `
            <h3>${p.title}</h3>
            <img src="${p.image}" alt="${p.title}" class="zoom">
            <p>${p.description}</p>
            <div>c. ${p.year}</div>
        `;
        containerElement.appendChild(article);
    };
}

export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
}

