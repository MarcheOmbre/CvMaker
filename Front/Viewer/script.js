function fillSection(sectionTitle, title, fillSection) {

    const section = document.getElementById(sectionTitle);

    section.getElementsByClassName("title-parent")[0].getElementsByClassName("title")[0].textContent = title;
    fillSection(section.getElementsByClassName("content")[0]);
}

function generateSettings() {

    document.documentElement.lang = "en";
    document.title = "My CV";

}

function generateCvHeader(dataJson) {

    if(!dataJson || !dataJson.content)
        return;
    
    document.getElementById("header_name").textContent = dataJson.content.Name;
    document.getElementById("header_profession").textContent = dataJson.content.Profession;

    if (isString(dataJson.image) && dataJson.image.length > 0) {
        document.getElementById("header_photo").src = dataJson.image;
    }


    // Generate contacts
    const contactsDivision = document.getElementById("header_contacts_list");
    dataJson.content.Contacts.forEach(element => {
        const li = document.createElement("li");
        li.classList.add("header_contacts_item");
        li.textContent = `${element.value}`;
        contactsDivision.appendChild(li);
    });

    // Generate links
    const linksDivision = document.getElementById("header_links_list");
    dataJson.content.Links.forEach((element) => {
        const li = document.createElement("li");
        li.classList.add("header_links_item");
        li.textContent = element.name + ": " + element.value;
        linksDivision.appendChild(li);
    });

}

function generateCvAboutMe(systemJson, dataJson) 
{
    if(!systemJson || !dataJson)
        return;
    
    fillSection("about-me", systemJson.AboutMeTitle, content =>{

        const textBloc = document.createElement("p");
        textBloc.textContent = dataJson.content.AboutMe;
        content.appendChild(textBloc);
    });
}

function generateCvSkills(systemJson, dataJson) 
{
    if(!systemJson || !dataJson)
        return;

    fillSection("skills", systemJson.SkillsTitle, content =>
        dataJson.content.Skills.forEach(element => {
            const li = document.createElement("li");
            li.classList.add("skills_item");
            li.textContent = element;
            content.appendChild(li);
        }));

}

function generateCvWork(systemJson, dataJson)  
{
    if(!systemJson || !dataJson)
        return;

    this.fillSection("work", systemJson.WorkTitle, content => {
        dataJson.content.WorkBlocs.forEach(element => {

            // Format date
            const fromDate = new Date(element.fromDate);
            const toDate = new Date(element.toDate);

            // Format month to force xx/yyyy format
            let month = (fromDate.getMonth() + 1).toString();
            if(month.length === 1)
                month = "0" + month;

            let stringDate = isDate(fromDate) ? `${month}/${fromDate.getFullYear()}` : "";
            if(isDate(toDate)){
                if(stringDate !== "")
                    stringDate += " - ";

                // Format month to force xx/yyyy format
                month = (toDate.getMonth() + 1).toString();
                if(month.length === 1)
                    month = "0" + month;

                stringDate += `${month}/${toDate.getFullYear()}`;
            }

            const workBlockTitle = document.createElement("h4");
            workBlockTitle.classList.add("work_bloc_title");
            workBlockTitle.textContent = element.name;

            const workBlockCorporation = document.createElement("p");
            workBlockCorporation.classList.add("work_bloc_corporation");
            workBlockCorporation.textContent = element.corporation;

            const workBlockDate = document.createElement("p");
            workBlockDate.classList.add("work_bloc_date");
            workBlockDate.textContent = stringDate;


            const workBlockHeader = document.createElement("div");
            workBlockHeader.classList.add("work_bloc_header");
            workBlockHeader.appendChild(workBlockTitle);
            workBlockHeader.appendChild(workBlockCorporation);
            workBlockHeader.appendChild(workBlockDate);

            const workBlockDescription = document.createElement("p");
            workBlockDescription.classList.add("work_bloc_description");
            workBlockDescription.textContent = element.description;

            const div = document.createElement("div");
            div.classList.add("work_item");
            div.appendChild(workBlockHeader);
            div.appendChild(workBlockDescription);

            content.appendChild(div);
        })
    });

}

function generateCvEducation(systemJson, dataJson) 
{
    if(!systemJson || !dataJson)
        return;

    fillSection("education", systemJson.EducationTitle, content => {
        dataJson.content.EducationBlocs.forEach(element => {

            const educationBlocTitle = document.createElement("h4");
            educationBlocTitle.classList.add("education_bloc_title");
            educationBlocTitle.textContent = element.name;

            const educationBlocDate = document.createElement("p");
            educationBlocDate.classList.add("education_bloc_date");
            educationBlocDate.textContent = isString(element.date) ? new Date(element.date).getFullYear() : "";

            const div = document.createElement("div");
            div.classList.add("education_item");
            div.appendChild(educationBlocTitle);
            div.appendChild(educationBlocDate);

            content.appendChild(div);
        })
    });

}

function generateCvLanguage(systemJson, dataJson)
{
    if(!systemJson || !dataJson)
        return;
    
    fillSection("languages", systemJson.LanguagesTitle, content => {
        dataJson.content.Languages.forEach(element => {
            const li = document.createElement("li");
            li.classList.add("languages_item");
            li.textContent = `${element.name} (${systemJson.LanguageLevels[element.level]})`;
            content.appendChild(li);
        })
    });

}

function generateCvProjects(systemJson, dataJson) {
    
    if(!systemJson || !dataJson)
        return;
    
    fillSection("projects", systemJson.ProjectsTitle, content => {
        dataJson.content.Projects.forEach(element => {

            const projectBlockTitle = document.createElement("h4");
            projectBlockTitle.classList.add("project_bloc_title");
            projectBlockTitle.textContent = element.name;

            const projectBlockDate = document.createElement("p");
            projectBlockDate.classList.add("project_bloc_date");
            projectBlockDate.textContent = isString(element.date) ? new Date(element.date).getFullYear() : "";

            const projectHeader = document.createElement("div");
            projectHeader.classList.add("project_bloc_header");
            projectHeader.appendChild(projectBlockTitle);
            projectHeader.appendChild(projectBlockDate);

            const projectBlockDescription = document.createElement("p");
            projectBlockDescription.classList.add("project_bloc_description");
            projectBlockDescription.textContent = element.description;

            const div = document.createElement("div");
            div.classList.add("project_item");
            div.appendChild(projectHeader);
            div.appendChild(projectBlockDescription);

            content.appendChild(div);
        })
    });

}

function generateCvHobbies(systemJson, dataJson) {

    if(!systemJson || !dataJson)
        return;
    
    fillSection("hobbies", systemJson.HobbiesTitle, content => {
        dataJson.content.Hobbies.forEach(element => {
            const li = document.createElement("li");
            li.textContent = element;
            content.appendChild(li);
        })
    });

}

function generateFromJson(dataJson) {

    if(!dataJson || !dataJson.content)
        return;
    
    fetch(dataJson.content.SystemLanguage).then(response =>
    {
        const systemJson = response.json();

        const dataObject = {};
        dataObject.image = dataJson.image;
        dataObject.content = JSON.parse(dataJson.content);
        
        generateSettings();
        generateCvHeader(dataObject);
        generateCvAboutMe(systemJson, dataObject);
        generateCvSkills(systemJson, dataObject);
        generateCvWork(systemJson, dataObject);
        generateCvEducation(systemJson, dataObject);
        generateCvLanguage(systemJson, dataObject);
        generateCvProjects(systemJson, dataObject);
        generateCvHobbies(systemJson, dataObject);
    });
}


document.addEventListener("DOMContentLoaded", async function () 
{
    generateFromJson(JSON.parse(sessionStorage.getItem(CvDataItemKey)));
})