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
    constructor(name, corporation, fromDate, toDate, description) {
        this.name = name;
        this.corporation = corporation;
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

        if (!isString(content))
            throw new Error("Content must be string");

        this.cvId = id;
        this.content = content;
    }
}


let systemJson;
const systemLanguageSelect = document.getElementById("system-language");
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
const alertElement = document.getElementById("alert");
const frame = document.getElementById("preview");


async function importFromJson(dataJson) {

    document.body.style.display = "none";

    // Clear the fields
    [...contactsDiv.children].forEach(element => element.remove());
    [...linksDiv.children].forEach(element => element.remove());
    [...skillsDiv.children].forEach(element => element.remove());
    [...worksDiv.children].forEach(element => element.remove());
    [...educationsDiv.children].forEach(element => element.remove());
    [...languagesDiv.children].forEach(element => element.remove());
    [...projectsDiv.children].forEach(element => element.remove());
    [...hobbiesDiv.children].forEach(element => element.remove());

    // Restore the fields
    const contentJson = JSON.parse(dataJson.content) ?? "";
    
    if (contentJson) {

        fetch(contentJson.SystemLanguage).then((response) => {

            systemJson = response.json().then(json => {

                systemJson = json
                
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
                    contentJson.WorkBlocs.forEach(element => addWork(element.name, element.corporation,
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
                
            })
        });
    } else {
        await fetch(systemLanguageSelect.value).then((response) => {
            systemJson = response.json().then(json => systemJson = json)
        });
    }

    if (dataJson.image) {
        if (isString(dataJson.image) && dataJson.image.length > 0) {
            fetch(dataJson.image).then((response) => response.blob())
                .then((blob) => {
                    const dt = new DataTransfer();
                    dt.items.add(new File([blob], 'image.jpg'));
                    photoInput.files = dt.files;
                }).then(_ => refreshImagePreview());
        }
    }

    document.body.style.display = "block";
}

async function generateJson() {
    const jsonObject = {};

    // Photo
    jsonObject.image = "";

    if (photoInput.files.length > 0 && photoInput.files[0])
        jsonObject.image = await convertFileToBase64(photoInput.files[0]);

    // Content
    jsonObject.content = "";

    const contentObject = {}
    contentObject.SystemLanguage = systemLanguageSelect.value;
    contentObject.Name = nameInput.value;
    contentObject.Profession = professionInput.value;

    contentObject.AboutMe = aboutMeInput.value;

    contentObject.Contacts = [];
    [...contactsDiv.children].forEach(element => {
        const children = element.children[1].children;
        const type = children[0].selectedIndex;
        const value = children[1].value;
        contentObject.Contacts.push(new Contact(type, value));
    });

    contentObject.Links = [];
    [...linksDiv.children].forEach(element => {
        const children = element.children[1].children;
        const name = children[0].value;
        const value = children[1].value;
        contentObject.Links.push(new Link(name, value));
    });

    contentObject.WorkBlocs = [];
    [...worksDiv.children].forEach((element) => {
        const children = element.children[1].children;
        const name = children[1].children[0].value;
        const corporation = children[3].value;
        const fromDate = children[5].children[0].value;
        const toDate = children[5].children[1].value;
        const description = children[6].value;
        contentObject.WorkBlocs.push(new WorkBloc(name, corporation, fromDate, toDate, description));
    });

    contentObject.EducationBlocs = [];
    [...educationsDiv.children].forEach(element => {
        const children = element.children[1].children;
        const name = children[0].value;
        const date = children[1].value;
        contentObject.EducationBlocs.push(new EducationBloc(name, date));
    });

    contentObject.Projects = [];
    [...projectsDiv.children].forEach((element, index) => {
        const children = element.children[1].children;
        const name = children[1].children[0].value;
        const date = children[3].value;
        const description = children[4].value;

        contentObject.Projects.push(new Project(name, date, description));
    })

    contentObject.Languages = [];
    [...languagesDiv.children].forEach(element => {
        const children = element.children[1].children;
        const name = children[0].value;
        const level = children[1].selectedIndex;
        contentObject.Languages.push(new Language(name, level));
    });

    contentObject.Skills = [];
    [...skillsDiv.children].forEach(element => {
        contentObject.Skills.push(element.children[1].children[0].value);
    })

    contentObject.Hobbies = [];
    [...hobbiesDiv.children].forEach(element => {
        contentObject.Hobbies.push(element.children[1].children[0].value);
    })

    jsonObject.content = JSON.stringify(contentObject);

    return jsonObject;
}

function refreshImagePreview() {
    const hidden = photoInput.files <= 0 || !photoInput.files[0];

    photoReader.style.display = hidden ? "none" : "block";

    if (!hidden) {

        const fileReader = new FileReader();
        fileReader.onload = function (e) {
            document.getElementById("photo-reader").src = e.target.result;
        };
        fileReader.readAsDataURL(photoInput.files[0]);

    } else {
        photoReader.src = "";
    }
}

function refreshElementsArrows(movableElementsParent) {
    for (let i = 0; i < movableElementsParent.children.length; i++) {
        const arrowsDiv = movableElementsParent.children[i].children[0];
        arrowsDiv.children[0].style.display = i === 0 ? "none" : "block";
        arrowsDiv.children[1].style.display = i === movableElementsParent.children.length - 1 ? "none" : "block";
    }
}

function encapsulateInMovable(htmlElement) {

    // Create arrow buttons
    const topArrow = document.createElement("button");
    topArrow.className = "top-arrow";
    topArrow.innerHTML = "&#8593;";
    const bottomArrow = document.createElement("button");
    bottomArrow.className = "bottom-arrow";
    bottomArrow.innerHTML = "&#8595;";
    const arrowsDiv = document.createElement("div");
    arrowsDiv.className = "arrows_div";
    arrowsDiv.append(topArrow, bottomArrow);

    const div = document.createElement("div");
    div.className = "movable_element";
    div.append(arrowsDiv, htmlElement);

    topArrow.addEventListener('click', _ => {
        const divParent = div.parentNode;
        divParent.insertBefore(div, div.previousElementSibling);
        refreshElementsArrows(div.parentElement);
    });

    bottomArrow.addEventListener('click', _ => {
        const divParent = div.parentNode;
        divParent.insertBefore(div, div.nextElementSibling.nextElementSibling);
        refreshElementsArrows(div.parentElement);
    });

    return div;
}

function addContact(contactType = 0, contactValue = "") {

    // Generate div
    const div = document.createElement("div");
    div.classList.add("contact_item");

    // Generate select
    const select = document.createElement("select");
    systemJson.ContactTypes.forEach(element => {
        const option = document.createElement("option");
        option.textContent = element;
        select.append(option);
    });

    if (isNumeric(contactType) && select.options.length > contactType) select.value = select.options[contactType].value;

    // Generate input and button
    const input = document.createElement("input");
    input.type = "text";
    input.value = contactValue;
    const button = document.createElement("button");
    button.textContent = "-";

    // Append elements
    div.append(select, input, button);

    const encapsulated = encapsulateInMovable(div);
    button.onclick = _ => encapsulated.remove();

    contactsDiv.append(encapsulated);
    refreshElementsArrows(contactsDiv);
}

function addLink(linkName = "", linkValue = "") {

    // Generate div
    const div = document.createElement("div");
    div.classList.add("link_item");

    // Generate input and button
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = linkName;
    const linkInput = document.createElement("input");
    linkInput.type = "text";
    linkInput.value = linkValue;
    const button = document.createElement("button");
    button.textContent = "-";

    // Append elements
    div.append(nameInput, linkInput, button);

    const encapsulated = encapsulateInMovable(div);
    button.onclick = _ => encapsulated.remove();

    linksDiv.append(encapsulated);
    refreshElementsArrows(linksDiv);
}

function addSkill(skillName = "") {

    // Generate div
    const div = document.createElement("div");
    div.classList.add("skill_item");

    // Generate input and button
    const input = document.createElement("input");
    input.type = "text";
    input.value = skillName;
    const button = document.createElement("button");
    button.textContent = "-";

    // Append elements
    div.append(input, button);

    const encapsulated = encapsulateInMovable(div);
    button.onclick = _ => encapsulated.remove();

    skillsDiv.append(encapsulated);
    refreshElementsArrows(skillsDiv);
}

function addWork(title = "", corporation = "", fromDate = Date.now(), toDate = Date.now(), description = "") {

    // Generate div
    const div = document.createElement("div");
    div.classList.add("work_item");

    // Title
    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Title : ";
    titleLabel.htmlFor = "work-title-value";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.name = "work-title-value";
    titleInput.value = title;
    const button = document.createElement("button");
    button.textContent = "-";
    const titleContent = document.createElement("div");
    titleContent.classList.add("title-content-div");
    titleContent.append(titleInput, button);


    // Corporation
    const corporationLabel = document.createElement("label");
    corporationLabel.textContent = "Corporation : ";
    corporationLabel.htmlFor = "work-corporation-value";
    const corporationInput = document.createElement("input");
    corporationInput.type = "text";
    corporationInput.classList.add("work-corporation-value");
    corporationInput.value = corporation;

    // Date
    const dateLabel = document.createElement("label");
    dateLabel.textContent = "Date : ";
    dateLabel.htmlFor = "work-from-date-value";
    const fromDateInput = document.createElement("input");
    fromDateInput.type = "date";
    fromDateInput.name = "work-from-date-value";
    fromDateInput.value = fromDate.toString();
    const toDateInput = document.createElement("input");
    toDateInput.type = "date";
    toDateInput.value = toDate.toString();
    const dateContent = document.createElement("div");
    dateContent.classList.add("date-content-div");
    dateContent.append(fromDateInput, toDateInput);

    // Description
    const index = worksDiv.children.length;
    const descriptionInput = document.createElement("textarea");
    descriptionInput.id = "work-description-value-" + index;
    descriptionInput.value = description;

    // Append elements
    div.append(titleLabel);
    div.append(titleContent);
    div.append(corporationLabel);
    div.append(corporationInput);
    div.append(dateLabel);
    div.append(dateContent);
    div.append(descriptionInput);

    const encapsulated = encapsulateInMovable(div);
    button.onclick = _ => encapsulated.remove();

    worksDiv.append(encapsulated);
    refreshElementsArrows(worksDiv);
}

function addEducation(title = "", date = Date.now()) {

    // Generate div
    const div = document.createElement("div");
    div.classList.add("education_item");

    // Title
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.value = title;

    // Date
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.value = date.toString();

    // Button
    const button = document.createElement("button");
    button.textContent = "-";

    // Append elements
    div.append(titleInput, dateInput, button);

    const encapsulated = encapsulateInMovable(div);
    button.onclick = _ => encapsulated.remove();

    educationsDiv.append(encapsulated);
    refreshElementsArrows(educationsDiv);
}

function addLanguage(level = 0, name = "") {

    // Generate div
    const div = document.createElement("div");
    div.classList.add("language_item");

    // Generate input
    const input = document.createElement("input");
    input.type = "text";
    input.value = name;

    // Generate select
    const select = document.createElement("select");
    systemJson.LanguageLevels.forEach(element => {

        const option = document.createElement("option");
        option.textContent = element;
        select.append(option);
    });

    if (isNumeric(level) && select.options.length > level) select.selectedIndex = level;

    // Generate button
    const button = document.createElement("button");
    button.textContent = "-";

    // Append elements
    div.append(input, select, button);

    const encapsulated = encapsulateInMovable(div);
    button.onclick = _ => encapsulated.remove();

    languagesDiv.append(encapsulated);
    refreshElementsArrows(languagesDiv);
}

function addProject(title = "", date = Date.now(), description = "") {

    // Generate div
    const div = document.createElement("div");
    div.classList.add("work_item");

    // Title
    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Title : ";
    titleLabel.htmlFor = "project-title-Value";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.name = "project-title-Value";
    titleInput.value = title;
    const button = document.createElement("button");
    button.textContent = "-";
    const titleContent = document.createElement("div");
    titleContent.classList.add("title-content-div");
    titleContent.append(titleInput, button);

    // Date
    const dateLabel = document.createElement("label");
    dateLabel.textContent = "Date : ";
    dateLabel.htmlFor = "project-date-value";
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.name = "project-date-value";
    dateInput.value = date.toString();

    // Description
    const index = projectsDiv.children.length;
    const descriptionInput = document.createElement("textarea");
    descriptionInput.id = "project-description-value-" + index;
    descriptionInput.value = description;

    // Append elements
    div.append(titleLabel, titleContent);
    div.append(dateLabel, dateInput);
    div.append(descriptionInput);

    const encapsulated = encapsulateInMovable(div);
    button.onclick = _ => encapsulated.remove();

    projectsDiv.append(encapsulated);
    refreshElementsArrows(projectsDiv);
}

function addHobby(name = "") {

    // Generate div
    const div = document.createElement("div");
    div.classList.add("hobby_item");

    // Generate input and button
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = name;
    const button = document.createElement("button");
    button.textContent = "-";

    // Append elements
    div.append(nameInput, button);

    const encapsulated = encapsulateInMovable(div);
    button.onclick = _ => encapsulated.remove();

    hobbiesDiv.append(encapsulated);
    refreshElementsArrows(hobbiesDiv);
}


document.addEventListener("DOMContentLoaded", async function () {

        if (!checkIsLogged()) {
            location.assign("../index.html")
            return;
        }

        document.getElementById("add-contact").onclick = _ => addContact();
        document.getElementById("add-link").onclick = _ => addLink();
        document.getElementById("add-skill").onclick = _ => addSkill();
        document.getElementById("add-work").onclick = _ => addWork();
        document.getElementById("add-education").onclick = _ => addEducation();
        document.getElementById("add-language").onclick = _ => addLanguage();
        document.getElementById("add-project").onclick = _ => addProject();
        document.getElementById("add-hobby").onclick = _ => addHobby();
        document.getElementById("download_template_button").onclick = _ => {
            const templateLink = document.createElement("a");
            templateLink.download = "CvTemplate.css";
            templateLink.href = "../Common/viewStyle.css";
            templateLink.click();
        }

        const saveButton = document.getElementById("save_button");
        saveButton.onclick = _ => {
            saveButton.disabled = true;

            function succeed() {
                alert("Success");
                saveButton.disabled = false;
            }

            function failed(error) {
                saveButton.disabled = false;
                alertElement.textContent = error.responseText;
            }

            generateJson().then(json => {
                const cvId = sessionStorage.getItem(CvIdItemKey);
                SendRequest("POST", document.cookie, null, APILink + "Cv/SetContent/",
                    new SetContentDto(cvId, json.content), () => {
                        if (isString(json.image) && json.image.length > 0) {
                            SendRequest("POST", document.cookie, null, APILink + "Cv/SetImage/",
                                new SetContentDto(cvId, json.image), succeed, err => failed(err))
                        } else succeed();
                    }, err => failed(err));
            })
        }

        document.getElementById("view_button").onclick = _ => {
            generateJson().then(json => {
                sessionStorage.setItem(CvDataItemKey, JSON.stringify(json));
                location.assign("../Viewer/index.html");
            });
        }

        systemLanguageSelect.onchange = event => {
            let index = 0;

            for (let i = 0; i < systemLanguageSelect.options.length; i++) {
                if (systemLanguageSelect.options[i].value !== event.target.value) continue;
                index = i;
                break;
            }

            systemLanguageSelect.selectedIndex = index;
            generateJson().then(json => importFromJson(json));
        }

        photoInput.onchange = _ => refreshImagePreview();

        // Download cv data
        const cvId = sessionStorage.getItem(CvIdItemKey);
        const parameters = [];
        parameters.push(new KeyPairValue("id", cvId));

        // Hide the page during loading
        document.body.style.display = "none";

        SendRequest("GET", document.cookie, parameters, APILink + `Cv/Get`, null, res => {
            const file = JSON.parse(res.responseText);
            importFromJson(file);
        }, res => alertElement.textContent = res.responseText);
    }
)