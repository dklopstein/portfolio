import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');
console.log(projects)
const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

let projectCount = projects.length;
let projectTitle = document.querySelector('.projects-title');
projectTitle.innerHTML = `${projectCount} Projects`;