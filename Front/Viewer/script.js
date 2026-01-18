const printButton = document.getElementById("print_button");

const nameEntry = document.getElementById("header_name");
const professionEntry = document.getElementById("header_profession");
const imageEntry = document.getElementById("header_photo");
const aboutMeSection = document.getElementById("about-me");
const contactsSection = document.getElementById("header_contacts_list");
const linksSection = document.getElementById("header_links_list");
const skillsSection = document.getElementById("skills");
const worksSection = document.getElementById("work");
const educationSection = document.getElementById("education");
const languagesSection = document.getElementById("languages");
const projectsSection = document.getElementById("projects");
const hobbiesSection = document.getElementById("hobbies");

const contactItemTemplate = document.getElementById("contact-item_template");
const linkItemTemplate = document.getElementById("link-item_template");
const aboutMeTemplate = document.getElementById("about-me_template");
const skillItemTemplate = document.getElementById("skill-item_template");
const workItemTemplate = document.getElementById("work-item_template");
const educationItemTemplate = document.getElementById("education-item_template");
const languageItemTemplate = document.getElementById("language-item_template");
const projectItemTemplate = document.getElementById("project-item_template");
const hobbyItemTemplate = document.getElementById("hobby-item_template");


function fillSection(section, title, fillSection) {
    if (!section)
        return;

    section.getElementsByClassName("title-parent")[0].getElementsByClassName("title")[0].textContent = title;
    fillSection(section.getElementsByClassName("content")[0]);
}


async function refreshCss(css) {
    
    let cssContent = DOMPurify.sanitize(css);
    if(!cssContent || !isString(cssContent))
        cssContent = await fetch("../Common/Template/style.css").then(response => response.text());

    const lastCss = document.getElementById("css");
    if(lastCss)
        lastCss.remove();
    
    const style = document.createElement('style');
    style.id = "css";
    style.textContent = cssContent;
    document.head.append(style);
}

function refreshSystemLanguage(language) {
    if (isString(language))
        document.documentElement.lang = DOMPurify.sanitize(language);
}

function refreshName(name) {
    if (!name || isString(name))
        nameEntry.textContent = DOMPurify.sanitize(name);
}

function refreshProfession(profession) {
    if (!profession || isString(profession))
        professionEntry.textContent = DOMPurify.sanitize(profession);
}

function refreshImage(image) {
    if (!image || isString(image))
        imageEntry.src = DOMPurify.sanitize(image);
    
    imageEntry.style.display = image  ? "block" : "none";
}

function refreshContacts(contacts) {

    if (!contacts || !Array.isArray(contacts))
        return;

    contactsSection.innerHTML = "";

    contacts.forEach(element => {

        if (!isString(element.value))
            return;

        const templateClone = document.importNode(contactItemTemplate.content, true).children[0];
        templateClone.textContent = DOMPurify.sanitize(element.value);
        contactsSection.appendChild(templateClone);
    });
}

function refreshLinks(links) {

    if (!links || !Array.isArray(links))
        return;

    linksSection.innerHTML = "";

    links.forEach(element => {

        if (!isString(element.name) || !isString(element.value))
            return;

        const templateClone = document.importNode(linkItemTemplate.content, true).children[0];
        templateClone.innerHTML = DOMPurify.sanitize(element.name + ": " + element.value);
        linksSection.appendChild(templateClone);
    });
}

function refreshAboutMe(title, text) {
    
    if (!isString(title))
        return;
    
    fillSection(aboutMeSection, title, content => {

        content.innerHTML = "";
        
        const templateClone = document.importNode(aboutMeTemplate.content, true).children[0];
        templateClone.innerHTML = DOMPurify.sanitize(text);
        content.appendChild(templateClone);
    });
}

function refreshSkills(title, skills) {
    if (!isString(title) || !skills || !Array.isArray(skills))
        return;

    skillsSection.children[1].innerHTML = "";

    fillSection(skillsSection, title, content =>
        skills.forEach(element => {

            if (!isString(element))
                return;

            const templateClone = document.importNode(skillItemTemplate.content, true).children[0];
            templateClone.textContent = DOMPurify.sanitize(element);
            content.appendChild(templateClone);
        }));

}

function refreshWorks(title, works) {
    
    if (!isString(title) || !works || !Array.isArray(works))
        return;

    worksSection.children[1].innerHTML = "";

    this.fillSection(worksSection, title, content => {
        works.forEach(element => {

            if (!isString(element.name) || !isString(element.company) || !isString(element.description))
                return;

            // Format date
            const fromDate = new Date(element.fromDate);
            const toDate = new Date(element.toDate);

            // Format month to force xx/yyyy format
            let month = (fromDate.getMonth() + 1).toString();
            if (month.length === 1)
                month = "0" + month;

            let stringDate = isDate(fromDate) ? `${month}/${fromDate.getFullYear()}` : "";
            if (isDate(toDate)) {
                if (stringDate !== "")
                    stringDate += " - ";

                // Format month to force xx/yyyy format
                month = (toDate.getMonth() + 1).toString();
                if (month.length === 1)
                    month = "0" + month;

                stringDate += `${month}/${toDate.getFullYear()}`;
            }

            const templateClone = document.importNode(workItemTemplate.content, true).children[0];
            const children = templateClone.children;
            children[0].children[0].textContent = DOMPurify.sanitize(element.name);
            children[0].children[1].textContent = DOMPurify.sanitize(element.company);
            children[0].children[2].textContent = DOMPurify.sanitize(stringDate);
            children[1].innerHTML = DOMPurify.sanitize(element.description);

            content.appendChild(templateClone);
        })
    });

}

function refreshEducations(title, educations) {
    if (!isString(title) || !educations || !Array.isArray(educations))
        return;

    educationSection.children[1].innerHTML = "";
    
    fillSection(educationSection, title, content => {
        educations.forEach(element => {

            if (!isString(element.name))
                return;

            const templateClone = document.importNode(educationItemTemplate.content, true).children[0];
            const children = templateClone.children;
            children[0].textContent = DOMPurify.sanitize(element.name);
            children[1].textContent = DOMPurify.sanitize(isString(element.date) ? new Date(element.date).getFullYear() : "");

            content.appendChild(templateClone);
        })
    });

}

function refreshLanguages(title, languages, languageLevels) {
    if (!isString(title) || !languages || !Array.isArray(languages) || !languageLevels || !Array.isArray(languageLevels))
        return;

    languagesSection.children[1].innerHTML = "";
    fillSection(languagesSection, title, content => {
        languages.forEach(element => {
            
            if (!isString(element.name) || !isNumeric(element.level) || element >= languageLevels.length)
                return;

            const templateClone = document.importNode(languageItemTemplate.content, true).children[0];
            templateClone.textContent = DOMPurify.sanitize(`${element.name} (${languageLevels[element.level]})`);

            content.appendChild(templateClone);
        })
    });

}

function refreshProjects(title, projects) {

    if (!isString(title) || !projects || !Array.isArray(projects))
        return;

    projectsSection.children[1].innerHTML = "";
    
    fillSection(projectsSection, title, content => {
        projects.forEach(element => {

            if (!isString(element.name) || !isString(element.description))
                return;

            const templateClone = document.importNode(projectItemTemplate.content, true).children[0];
            const children = templateClone.children;
            children[0].children[0].textContent = DOMPurify.sanitize(element.name);
            children[0].children[1].textContent = DOMPurify.sanitize(isString(element.date) ? new Date(element.date).getFullYear() : "");
            children[1].innerHTML = DOMPurify.sanitize(element.description);
            
            content.appendChild(templateClone);
        })
    });

}

function refreshHobbies(title, hobbies) {

    if (!isString(title) || !hobbies || !Array.isArray(hobbies))
        return;

    hobbiesSection.children[1].innerHTML = "";
    
    fillSection(hobbiesSection, title, content => {
        hobbies.forEach(element => {

            if (!isString(element))
                return;

            const templateClone = document.importNode(hobbyItemTemplate.content, true).children[0];
            templateClone.textContent = DOMPurify.sanitize(element);
            content.appendChild(templateClone);
        })
    });

}

async function refreshFromJson(dataJson) {
    
    if (!dataJson)
        return
    
    if(isString(dataJson.content))
    {
        const content = JSON.parse(dataJson.content);
        const systemLanguage = await fetch(content.SystemLanguage).then(response => response.json());
        
        refreshSystemLanguage(systemLanguage.key);
        refreshName(content.Name);
        refreshAboutMe(systemLanguage.AboutMeTitle, content.AboutMe);
        refreshProfession(content.Profession);
        refreshImage(dataJson.image);
        refreshContacts(content.Contacts);
        refreshLinks(content.Links);
        refreshSkills(systemLanguage.SkillsTitle, content.Skills);
        refreshWorks(systemLanguage.WorkTitle, content.WorkBlocs);
        refreshEducations(systemLanguage.EducationTitle, content.EducationBlocs);
        refreshLanguages(systemLanguage.LanguagesTitle, content.Languages, systemLanguage.LanguageLevels);
        refreshProjects(systemLanguage.ProjectsTitle, content.Projects);
        refreshHobbies(systemLanguage.HobbiesTitle, content.Hobbies);   
    }
    
    await refreshCss(dataJson.customCss);
}

document.addEventListener("DOMContentLoaded", () => {
    printButton.onclick = _ => {
        printButton.style.display = "none";
        this.print();
        printButton.style.display = "block";
    }
});
