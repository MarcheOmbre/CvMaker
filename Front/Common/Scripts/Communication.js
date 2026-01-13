class KeyPairValue{
    constructor(key, value) {
        
        if(!isString(key))
            throw new Error("Key must be a string");
        
        this.key = key;
        this.value = value;
    }
}

function SendRequest(type, tokenToInject, parameters, link, data, onSucceed, onFailed){
    
    if(type !== "GET" && type !== "POST" && type !== "PUT" && type !== "DELETE")
        throw new Error("Invalid request type");
    
    if(!isString(link))
        throw new Error("Link must be a string")
    
    // Inject parameters if there are any
    if(parameters)
    {
        let parametersString = "";
        for(let i = 0; i < parameters.length; i++)
        {
            if(!(parameters[i] instanceof KeyPairValue))
                throw new Error("Parameters must be KeyPairValue");

            parametersString += parameters[i].key + "=" + parameters[i].value;
            if(i !== parameters.length - 1)
                parametersString += "&";
        }

        link += "?" + parametersString;
    }

    // Create the request
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open(type, link, true);
    xmlHttp.setRequestHeader("Content-Type", data ? "application/json" : "text/plain; charset=utf-8");
    
    // Insert the token if there is one
    if(isString(tokenToInject) && tokenToInject !== "")
        xmlHttp.setRequestHeader("Authorization", TokenKey + " " + tokenToInject);
    
    xmlHttp.onreadystatechange = function()
    {
        if(xmlHttp.readyState !== 4)
            return;
        
        if (xmlHttp.status !== 200)
        {
            onFailed(xmlHttp);
            return;
        }

        onSucceed(xmlHttp);
    }
    
    xmlHttp.send(JSON.stringify(data));
}