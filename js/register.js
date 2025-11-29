if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/js/swC.js')
        .then(reg => {  
            console.log("Service Worker Registered Succesful", reg);
        })
        .catch(err => console.error('Service Worker Registation Failed',err))
    })
}