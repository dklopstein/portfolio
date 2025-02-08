import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');
console.log(projects)
const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

let projectCount = projects.length;
let projectTitle = document.querySelector('.projects-title');
projectTitle.innerHTML = `${projectCount} Projects`;


let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let arc = arcGenerator({
    startAngle: 0,
    endAngle: 2 * Math.PI,
});
// Refactor all plotting into one function
function renderPieChart(projectsGiven) {
    // re-calculate rolled data
    let newRolledData = d3.rollups(
      projectsGiven,
      (v) => v.length,
      (d) => d.year,
    );

    // re-calculate data
    let newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year };
    });
    
    // re-calculate slice generator, arc data, arc, colors
    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcs = newArcData.map((d) => arcGenerator(d));
    let colors = d3.scaleOrdinal(d3.schemeTableau10);
    
    // clear up paths and legends
    let newSVG = d3.select('svg'); 
    let legend = d3.select('.legend');
    newSVG.selectAll('path').remove();
    legend.selectAll('li').remove();

    // update paths and legends
    newArcs.forEach((arc, idx) => {
        d3.select('svg')
          .append('path')
          .attr('d', arc)
          .attr('fill', colors(idx))
    });

    
    newData.forEach((d, idx) => {
        legend.append('li')
            .attr('class', 'legend')
            .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
    });
}
  
// Render Projects
renderPieChart(projects);

// Search Function + Render Filtered Projects
let query = '';
let searchInput = document.querySelector('.search-bar');

searchInput.addEventListener('input', (event) => {
    // get query value
    query = event.target.value.toLowerCase();

    // filter projects
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });

    // render filtered projects
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
});

