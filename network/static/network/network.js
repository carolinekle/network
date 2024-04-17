document.addEventListener('DOMContentLoaded', function() {
    const save = document.querySelector('#edit')
    save.addEventListener('click', function(post_id){

        console.log("AND I DREAM EACH NIGHT OF SOME VERSION OF YOU");
         let text=document.querySelector('#new_text').value
         let currentDate = new Date();

        let currentDayOfMonth = currentDate.getDate();
        let currentMonth = currentDate.getMonth(); 
        let currentYear = currentDate.getFullYear();
        let currentTime = currentDate.getTime();
        let dateString = currentDayOfMonth  + (currentMonth + 1) + currentYear + currentTime;

        fetch(`/edit_posts/${post_id}`, {
        method: 'POST',
        body: JSON.stringify({
            text: text,
            updated: dateString
        })
        })

    })
})