
exports.getdate=function (){
const today = new Date();
    const options = {
        weekday: "long",
        day:"numeric",
        month:"long",
        year:"numeric"
    };

    return today.toLocaleDateString("en-US",options);
}

module.exports.getday=getday;
function getday(){
    const today = new Date();
        const options = {
            weekday: "long",
           
        };
    
        const day = today.toLocaleDateString("en-US",options);
    
        return day;
    }