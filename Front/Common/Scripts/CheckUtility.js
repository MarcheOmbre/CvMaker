function isNumeric(num) 
{
    return (typeof(num) === 'number' || typeof(num) === "string" && num.trim() !== '') && !isNaN(num);
}

function isString(str) 
{
    return typeof(str) === 'string' && str.trim() !== '';
}

function isDate(date){
    return date instanceof Date && !isNaN(date.getTime());
}

function isMatchingMailPattern(str){
    return str.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
}

function checkIsLogged(){
    return document.cookie !== "";
}