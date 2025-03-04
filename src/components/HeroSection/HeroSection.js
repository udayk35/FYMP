export const getStarted = (to)=>{
    console.log(to);
document.querySelector(to).scrollIntoView({behaviour:"smooth"});
}