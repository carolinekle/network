document.addEventListener('DOMContentLoaded', function() {
    const save = document.querySelector('#edit')
    save.addEventListener('click', function(post_id){

        console.log("AND I DREAM EACH NIGHT OF SOME VERSION OF YOU");
         text=document.querySelector('#new_text').value
        event.preventDefault();
        fetch('/edit_posts/${post_id}', {
        method: 'PUT',
        body: JSON.stringify({
            text: text
        })
        })
        .then(response => response.json())
        .then(result => {
            console.log(text);
        });
 
    })
})