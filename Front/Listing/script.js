class SetNameDto {
    constructor(cvId, name) 
    {
        if(!isNumeric(cvId))
            throw new Error("Id must be a number");
        
        if(!isString(name))
            throw new Error("Name must be a string");
        
        if(name.trim() === "")
            throw new Error("Name can't be empty");
        
        this.cvId = cvId;
        this.name = name;
    }
}

const cvParent = document.getElementById("cvs");
const alert = document.getElementById("alert");
const createButton = document.getElementById("create_button");

document.addEventListener("DOMContentLoaded", async function () {
    
    if (!checkIsLogged()) {
        location.assign("../index.html")
        return;
    }
    
    // Load all the cvs
    SendRequest("GET", document.cookie, null, APILink + "Cv/GetAll", null, 
            res => 
            {
                const json = JSON.parse(res.responseText);
                for (const cv of json) {
                    const cvElement = document.createElement("div");
                    cvElement.classList.add("cv_element");
                    
                    const textInput = document.createElement("input");
                    textInput.value = cv.name;
                    textInput.onchange = _ =>{
                        
                        if(!isString(textInput.value) || textInput.value.trim() === ""){
                            textInput.value = cv.name;
                            return;
                        }
                        
                        SendRequest("POST", document.cookie, null,
                            APILink + "Cv/SetName", new SetNameDto(cv.id, textInput.value),
                            _ => location.reload(),
                            res => alert.textContent = res.responseText);
                    }
                    
                    const openButton = document.createElement("button");
                    openButton.classList.add("cv_button");
                    openButton.textContent = "->";
                    openButton.onclick = _ =>{
                        sessionStorage.setItem(CvIdItemKey, cv.id);
                        location.assign("../Generator/index.html");
                    } 
                    
                    const deleteButton = document.createElement("button");
                    deleteButton.classList.add("cv_button");
                    deleteButton.textContent = "X";
                    deleteButton.onclick = _ => {
                        if (confirm("Are you sure you want to delete this CV?")) 
                        {
                            const parameters = [];
                            parameters.push(new KeyPairValue("id", cv.id));
                            
                            SendRequest("DELETE", document.cookie, parameters,
                                APILink + `Cv/Delete/`, null,
                                _ => location.reload(),
                                res => alert.textContent = res.responseText);
                        }
                    }
                    
                    cvElement.appendChild(textInput);
                    cvElement.appendChild(openButton);
                    cvElement.appendChild(deleteButton);
                    
                    cvParent.appendChild(cvElement);
                }
            }, res => alert.textContent = res.responseText);

    const parameters = [];
    parameters.push(new KeyPairValue("name", "CV"));
    createButton.onclick = _ => {
        SendRequest("PUT", document.cookie, parameters,
            APILink + "Cv/Create", null,
            _ => location.reload(),
            res => alert.textContent = res.responseText)};
})