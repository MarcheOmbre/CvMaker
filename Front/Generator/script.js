class Contact {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }

}

class Link {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}

class WorkBloc {
    constructor(name, company, fromDate, toDate, description) {
        this.name = name;
        this.company = company;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.description = description;
    }
}

class EducationBloc {
    constructor(name, date) {
        this.name = name;
        this.date = date;
    }
}

class Project {
    constructor(name, date, description) {
        this.name = name;
        this.date = date;
        this.description = description;
    }
}

class Language {
    constructor(name, level) {
        this.name = name;
        this.level = level;
    }
}

class SetContentDto {
    constructor(id, content) {

        if (!isNumeric(id))
            throw new Error("Id must be numeric");

        if (content && !isString(content))
            throw new Error("Content must be string");

        this.cvId = id;
        this.content = content;
    }
}


let systemJson;
const systemLanguageSelect = document.getElementById("system-language");
const removePhotoButton = document.getElementById("photo-remove_button");
const photoInput = document.getElementById("photo-input");
const photoReader = document.getElementById("photo-reader");
const nameInput = document.getElementById("name_input");
const professionInput = document.getElementById("profession_input");
const aboutMeInput = document.getElementById("about-me_input");
const contactsDiv = document.getElementById("contacts");
const linksDiv = document.getElementById("links");
const skillsDiv = document.getElementById("skills");
const worksDiv = document.getElementById("works");
const educationsDiv = document.getElementById("educations");
const languagesDiv = document.getElementById("languages");
const projectsDiv = document.getElementById("projects");
const hobbiesDiv = document.getElementById("hobbies");
const removeCssButton = document.getElementById("css-remove_button");
const customCssInput = document.getElementById("custom-css_input");
const alertElement = document.getElementById("alert");
const frame = document.getElementById("preview");

const encapsulationArrowTemplate = document.getElementById("encapsulation-arrow_template");
const contactItemTemplate = document.getElementById("contact-item_template");
const linkItemTemplate = document.getElementById("link-item_template");
const skillItemTemplate = document.getElementById("skill-item_template");
const workItemTemplate = document.getElementById("work-item_template");
const educationItemTemplate = document.getElementById("education-item_template");
const languageItemTemplate = document.getElementById("language-item_template");
const projectItemTemplate = document.getElementById("project-item_template");
const hobbyItemTemplate = document.getElementById("hobby-item_template");


async function importFromJson(dataJson) {

    document.body.style.display = "none";

    // Clear the fields
    contactsDiv.innerHTML = "";
    linksDiv.innerHTML = "";
    skillsDiv.innerHTML = "";
    worksDiv.innerHTML = "";
    educationsDiv.innerHTML = "";
    languagesDiv.innerHTML = "";
    projectsDiv.innerHTML = "";
    hobbiesDiv.innerHTML = "";

    // Restore the fields
    const contentJson = JSON.parse(dataJson.content) ?? "";

    if (contentJson) {

        systemJson = await fetch(contentJson.SystemLanguage).then(response => response.json());

        if (isString(contentJson.Name))
            nameInput.value = contentJson.Name;

        if (isString(contentJson.Profession))
            professionInput.value = contentJson.Profession;

        if (isString(contentJson.AboutMe))
            aboutMeInput.value = contentJson.AboutMe;

        if (contentJson.Contacts)
            contentJson.Contacts.forEach(element => {
                addContact(element.type, element.value)
            });

        if (contentJson.Links)
            contentJson.Links.forEach(element => {
                addLink(element.name, element.value)
            });

        if (contentJson.WorkBlocs) {
            contentJson.WorkBlocs.forEach(element => addWork(element.name, element.company,
                element.fromDate, element.toDate, element.description));
        }

        if (contentJson.EducationBlocs) {
            contentJson.EducationBlocs.forEach(element => addEducation(element.name, element.date));
        }

        if (contentJson.Projects)
            contentJson.Projects.forEach(element => addProject(element.name, element.date, element.description));

        if (contentJson.Languages)
            contentJson.Languages.forEach(element => addLanguage(element.level, element.name));

        if (contentJson.Skills)
            contentJson.Skills.forEach(element => addSkill(element));

        if (contentJson.Hobbies)
            contentJson.Hobbies.forEach(element => addHobby(element));
    } else {
        systemJson = await fetch(systemLanguageSelect.value).then(response => response.json());
    }

    if (dataJson.image) {
        if (!isString(dataJson.image) || dataJson.image.length === 0)
            return;

        const blob = await fetch(dataJson.image).then(response => response.blob());
        if (blob) {
            const dt = new DataTransfer();
            dt.items.add(new File([blob], 'image.jpg'));
            photoInput.files = dt.files;
        }
        
        refreshImage();
    }
    
    if(dataJson.customCss) {
        const blob = new Blob([dataJson.customCss], {type: 'text/css'});
        if(blob){
            const dt = new DataTransfer();
        
            dt.items.add(new File([blob], 'customCss.css'));
            customCssInput.files = dt.files;
        }
        await refreshCustomCss();
    }

    document.body.style.display = "block";
}

async function generateJson() {
    
    const jsonObject = {};

    /*
     *
     * Content
     * 
     */
    jsonObject.content = "";

    const contentObject = {}
    contentObject.SystemLanguage = DOMPurify.sanitize(systemLanguageSelect.value);
    contentObject.Name = extractName();
    contentObject.Profession = extractProfession();
    contentObject.AboutMe = extractAboutMe();
    contentObject.Contacts = extractContacts();
    contentObject.Links = extractLinks();
    contentObject.WorkBlocs = extractWorks();
    contentObject.EducationBlocs = extractEducations();
    contentObject.Projects = extractProjects();
    contentObject.Languages = extractLanguages();
    contentObject.Skills = extractSkills();
    contentObject.Hobbies = extractHobbies();
    jsonObject.content = JSON.stringify(contentObject);

    /*
     *
     * Image
     * 
     */
    jsonObject.image = "";

    if (photoInput.files.length > 0 && photoInput.files[0])
        jsonObject.image = DOMPurify.sanitize(await convertFileToBase64(photoInput.files[0]));

    /*
     *
     * Custom CSS
     * 
     */
    jsonObject.customCss = "";
    if(customCssInput.files.length > 0 && customCssInput.files[0])
        jsonObject.customCss = DOMPurify.sanitize(await customCssInput.files[0].text());
    
    return jsonObject;
}


function extractName() {
    return DOMPurify.sanitize(nameInput.value);
}

function extractProfession() {
    return DOMPurify.sanitize(professionInput.value);
}

function extractAboutMe() {
    return DOMPurify.sanitize(aboutMeInput.value);
}

function extractContacts() {

    const contacts = [];
    [...contactsDiv.children].forEach(element => {
        const children = element.children[1].children;
        const type = children[0].selectedIndex;
        const value = DOMPurify.sanitize(children[1].value);
        contacts.push(new Contact(type, value));
    });

    return contacts;
}

function extractLinks() {

    const links = [];
    [...linksDiv.children].forEach(element => {
        const children = element.children[1].children;
        const name = DOMPurify.sanitize(children[0].value);
        const value = DOMPurify.sanitize(children[1].value);
        links.push(new Link(name, value));
    });

    return links;
}

function extractWorks() {
    const works = [];
    [...worksDiv.children].forEach((element, index) => {
        const children = element.children[1].children;
        const name = DOMPurify.sanitize(children[1].children[0].value);
        const company = DOMPurify.sanitize(children[3].value);
        const fromDate = DOMPurify.sanitize(children[5].children[0].value);
        const toDate = DOMPurify.sanitize(children[5].children[1].value);
        const description = DOMPurify.sanitize(children[7].value);
        works.push(new WorkBloc(name, company, fromDate, toDate, description));
    })

    return works;
}

function extractEducations() {

    const educations = [];
    [...educationsDiv.children].forEach(element => {
        const children = element.children[1].children;
        const name = DOMPurify.sanitize(children[0].value);
        const date = DOMPurify.sanitize(children[1].value);
        educations.push(new EducationBloc(name, date));
    })

    return educations;
}

function extractProjects() {
    const projects = [];
    [...projectsDiv.children].forEach((element, index) => {
        const children = element.children[1].children;
        const name = DOMPurify.sanitize(children[1].children[0].value);
        const date = DOMPurify.sanitize(children[3].value);
        const description = DOMPurify.sanitize(children[4].value);
        projects.push(new Project(name, date, description));
    })

    return projects;
}

function extractLanguages() {
    const languages = [];
    [...languagesDiv.children].forEach(element => {
        const children = element.children[1].children;
        const name = DOMPurify.sanitize(children[0].value);
        const level = children[1].selectedIndex;
        languages.push(new Language(name, level));
    })

    return languages;
}

function extractSkills() {

    const skills = [];
    [...skillsDiv.children].forEach(element => {
        skills.push(DOMPurify.sanitize(element.children[1].children[0].value));
    })

    return skills;
}

function extractHobbies() {

    const hobbies = [];
    [...hobbiesDiv.children].forEach(element => {
        hobbies.push(DOMPurify.sanitize(element.children[1].children[0].value));
    })

    return hobbies;
}

function refreshImage() {
    
    const hasFile = photoInput.files.length > 0 && photoInput.files[0];

    photoReader.style.display = hasFile ?  "block" : "none";
    removePhotoButton.style.display = hasFile ?  "block" : "none";
    
    if (hasFile) {

        const fileReader = new FileReader();
        fileReader.onload = function (e) {
            photoReader.src = e.target.result;
        };
        fileReader.readAsDataURL(photoInput.files[0]);

    } else
        photoReader.src = '';
}

function refreshImagePreview(){
    
    if(photoInput.files.length > 0 && photoInput.files[0])
    {
        const fileReader = new FileReader();
        fileReader.onload = function (e) {
            frame.contentWindow.refreshImage(e.target.result);
        };
        fileReader.readAsDataURL(photoInput.files[0]);
    }
    else
        frame.contentWindow.refreshImage(null);
}

async function refreshCustomCss() {
    const hasFile = customCssInput.files.length > 0 && customCssInput.files[0];
    removeCssButton.style.display = hasFile ? "block" : "none";
    const customCss = hasFile ? DOMPurify.sanitize(await customCssInput.files[0].text()) : "";
    await frame.contentWindow.refreshCss(customCss);
}

function refreshElementsArrows(movableElementsParent) {
    for (let i = 0; i < movableElementsParent.children.length; i++) {
        const arrowsDiv = movableElementsParent.children[i].children[0];
        arrowsDiv.children[0].style.display = i === 0 ? "none" : "block";
        arrowsDiv.children[1].style.display = i === movableElementsParent.children.length - 1 ? "none" : "block";
    }
}

async function refreshViewerJson() {
    const json = await generateJson();
    await frame.contentWindow.refreshFromJson(json)
}


function encapsulateInMovable(htmlElement, refreshFunction) {
    
    const template = document.importNode(encapsulationArrowTemplate.content, true).children[0];
    template.append(htmlElement);
    template.children[0].children[0].addEventListener('click', _ => {
        const divParent = template.parentNode;
        divParent.insertBefore(template, template.previousElementSibling);
        refreshElementsArrows(template.parentElement);
        refreshFunction();
    });
    template.children[0].children[1].addEventListener('click', _ => {
        const divParent = template.parentNode;
        divParent.insertBefore(template, template.nextElementSibling.nextElementSibling);
        refreshElementsArrows(template.parentElement);
        refreshFunction();
    });

    return template;
}


function addContact(contactType = 0, contactValue = "") {

    const refreshFunction = () => frame.contentWindow.refreshContacts(extractContacts());

    const template = document.importNode(contactItemTemplate.content, true).children[0];
    const children = template.children;

    children[0].onchange = refreshFunction;
    children[1].oninput = refreshFunction;

    systemJson.ContactTypes.forEach(element => {
        const option = document.createElement("option");
        option.textContent = element;
        children[0].append(option);
    });

    if (isNumeric(contactType) && contactType <= children[0].options.length)
        children[0].selectedIndex = contactType;

    children[1].value = contactValue;

    const encapsulated = encapsulateInMovable(template, refreshFunction);
    children[2].onclick = _ => {
        encapsulated.remove();
        refreshFunction();
    }

    contactsDiv.append(encapsulated);
    refreshElementsArrows(contactsDiv);
}

function addLink(linkName = "", linkValue = "") {

    const refreshFunction = () => frame.contentWindow.refreshLinks(extractLinks());

    const template = document.importNode(linkItemTemplate.content, true).children[0];
    const children = template.children;

    children[0].oninput = refreshFunction;
    children[1].oninput = refreshFunction;

    children[0].value = linkName;
    children[1].value = linkValue;

    const encapsulated = encapsulateInMovable(template, refreshFunction);
    children[2].onclick = _ => {
        encapsulated.remove();
        refreshFunction();
    }

    linksDiv.append(encapsulated);
    refreshElementsArrows(linksDiv);
}

function addSkill(skillName = "") {

    const refreshFunction = () => frame.contentWindow.refreshSkills(systemJson.SkillsTitle, extractSkills());

    const template = document.importNode(skillItemTemplate.content, true).children[0];
    const children = template.children;

    children[0].oninput = refreshFunction;

    children[0].value = skillName;

    const encapsulated = encapsulateInMovable(template, refreshFunction);
    children[1].onclick = _ => {
        encapsulated.remove();
        refreshFunction();
    }

    skillsDiv.append(encapsulated);
    refreshElementsArrows(skillsDiv);
}

function addWork(title = "", company = "", fromDate = Date.now(), toDate = Date.now(), description = "") {

    const refreshFunction = () => frame.contentWindow.refreshWorks(systemJson.WorkTitle, extractWorks());
    
    const templateClone = document.importNode(workItemTemplate.content, true).children[0];
    const children = templateClone.children;

    children[1].children[0].oninput = refreshFunction;
    children[3].oninput = refreshFunction;
    children[5].children[0].onchange = refreshFunction;
    children[5].children[1].onchange = refreshFunction;
    children[7].oninput = refreshFunction;

    children[1].children[0].value = title;
    children[3].value = company;
    children[5].children[0].value = fromDate.toString();
    children[5].children[1].value = toDate.toString();
    children[7].value = description;
    worksDiv.append(templateClone);

    const encapsulated = encapsulateInMovable(templateClone, refreshFunction);
    children[1].children[1].onclick = _ => {
        encapsulated.remove();
        refreshFunction()
    }

    worksDiv.append(encapsulated);
    refreshElementsArrows(worksDiv);
}

function addEducation(title = "", date = Date.now()) {

    const refreshFunction = () => frame.contentWindow.refreshEducations(systemJson.EducationTitle, extractEducations());

    const templateClone = document.importNode(educationItemTemplate.content, true).children[0];
    const children = templateClone.children;

    children[0].oninput = refreshFunction;
    children[1].onchange = refreshFunction;

    children[0].value = title;
    children[1].value = date.toString();

    const encapsulated = encapsulateInMovable(templateClone, refreshFunction);
    children[2].onclick = _ => {
        encapsulated.remove();
        refreshFunction();
    }

    educationsDiv.append(encapsulated);
    refreshElementsArrows(educationsDiv);
}

function addLanguage(level = 0, name = "") {

    const refreshFunction = () => frame.contentWindow.refreshLanguages(systemJson.LanguagesTitle, extractLanguages(), systemJson.LanguageLevels);

    const templateClone = document.importNode(languageItemTemplate.content, true).children[0];
    const children = templateClone.children;

    children[0].oninput = refreshFunction;
    children[1].onchange = refreshFunction;

    children[0].value = name;

    systemJson.LanguageLevels.forEach(element => {

        const option = document.createElement("option");
        option.textContent = element;
        children[1].append(option);
    });

    if (isNumeric(level) && level <= children[1].options.length)
        children[1].selectedIndex = level;

    const encapsulated = encapsulateInMovable(templateClone, refreshFunction);
    children[2].onclick = _ => {
        encapsulated.remove();
        refreshFunction()
    }

    languagesDiv.append(encapsulated);
    refreshElementsArrows(languagesDiv);
}

function addProject(title = "", date = Date.now(), description = "") {

    const refreshFunction = () => frame.contentWindow.refreshProjects(systemJson.ProjectsTitle, extractProjects());

    const templateClone = document.importNode(projectItemTemplate.content, true).children[0];
    const children = templateClone.children;

    children[1].children[0].oninput = refreshFunction;
    children[3].onchange = refreshFunction;
    children[4].oninput = refreshFunction;

    children[1].children[0].value = title;
    children[3].value = date.toString();
    children[4].value = description;

    const encapsulated = encapsulateInMovable(templateClone, refreshFunction);
    children[1].children[1].onclick = _ => {
        encapsulated.remove();
        refreshFunction();
    }

    projectsDiv.append(encapsulated);
    refreshElementsArrows(projectsDiv);
}

function addHobby(name = "") {

    const refreshFunction = () => frame.contentWindow.refreshHobbies(systemJson.HobbiesTitle, extractHobbies());

    const templateClone = document.importNode(hobbyItemTemplate.content, true).children[0];
    const children = templateClone.children;

    children[0].oninput = _ => refreshFunction();
    children[0].value = name;

    const encapsulated = encapsulateInMovable(templateClone, refreshFunction);
    children[1].onclick = _ => {
        encapsulated.remove();
        refreshFunction();
    }

    hobbiesDiv.append(encapsulated);
    refreshElementsArrows(hobbiesDiv);
}


document.addEventListener("DOMContentLoaded", async function () {

        if (!checkIsLogged()) {
            location.assign("../index.html")
            return;
        }

        systemLanguageSelect.onchange = async function (event) {
            let index = 0;
            for (let i = 0; i < systemLanguageSelect.options.length; i++) {
                if (systemLanguageSelect.options[i].value !== event.target.value) continue;
                index = i;
                break;
            }
            systemLanguageSelect.selectedIndex = index;
            await refreshViewerJson();
        };
        removePhotoButton.onclick = _ => {
            photoInput.value = '';
            refreshImage();
            refreshImagePreview();
        };
        photoInput.onchange = _ => {
            refreshImage();
            refreshImagePreview();
        };
        nameInput.oninput = _ => frame.contentWindow.refreshName(extractName());
        professionInput.oninput = _ => frame.contentWindow.refreshProfession(extractProfession());
        aboutMeInput.oninput = _ => frame.contentWindow.refreshAboutMe(systemJson.AboutMeTitle, extractAboutMe());
        document.getElementById("add-contact").onclick = _ => addContact();
        document.getElementById("add-link").onclick = _ => addLink();
        document.getElementById("add-skill").onclick = _ => addSkill();
        document.getElementById("add-work").onclick = _ => addWork();
        document.getElementById("add-education").onclick = _ => addEducation();
        document.getElementById("add-language").onclick = _ => addLanguage();
        document.getElementById("add-project").onclick = _ => addProject();
        document.getElementById("add-hobby").onclick = _ => addHobby();
        removeCssButton.onclick = _ => {
            customCssInput.value = ''
            refreshCustomCss();
        };
        customCssInput.onchange = () => refreshCustomCss();
        
        
        document.getElementById("download_template_button").onclick = async function () {

            document.getElementById("download_template_button").onclick = _ => {
                const templateLink = document.createElement("a");
                templateLink.download = "template.css";
                templateLink.href = "../Common/Template/style.css";
                templateLink.click();
            }
        };

        const saveButton = document.getElementById("save_button");
        saveButton.onclick = async function () {
            saveButton.disabled = true;

            const generatedJson = await generateJson();
            const cvId = sessionStorage.getItem(CvIdItemKey);
            
            await SendRequest("POST", document.cookie, null, APILink + "Cv/SetContent/",
                new SetContentDto(cvId, generatedJson.content, null, err => alertElement.textContent = err));

            await SendRequest("POST", document.cookie, null, APILink + "Cv/SetImage/",
                new SetContentDto(cvId, generatedJson.image), null, err => alertElement.textContent = err);

            await SendRequest("POST", document.cookie, null, APILink + "Cv/SetCustomCss/",
                new SetContentDto(cvId, generatedJson.customCss), null, err => alertElement.textContent = err);
            
            saveButton.disabled = false;
        };

        // Download cv data
        const cvId = sessionStorage.getItem(CvIdItemKey);
        const parameters = [];
        parameters.push(new KeyPairValue("id", cvId));

        // Hide the page during loading
        document.body.style.display = "none";

        await SendRequest("GET", document.cookie, parameters, APILink + `Cv/Get`, null, async function (res) {

            const file = JSON.parse(res);
            await importFromJson(file);
            await refreshViewerJson();
        }, res => alertElement.textContent = res);
    }
)