
document.addEventListener('DOMContentLoaded', function() {

    const save = document.querySelector('#edit')
    const likeButtons =document.querySelectorAll('#like')

    function getCookie(name){
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if(parts.length == 2) return parts.pop().split(';').shift();
    }

    likeButtons.forEach(btn =>{ 
        btn.addEventListener('click', function (){
            
            let post_id = this.value 
            let likedPost = document.querySelector(`#liked_${post_id}`)


            fetch(`/like/${post_id}`, {
                method: 'POST',
                headers: {"Content-type": "application/json", "X-CSRFToken": getCookie("csrftoken")},
                body: JSON.stringify({
                    post_liked: post_id
                }),
                
            })
            .then( response => response.json)
            .then(data => {
                if (data.message === 'like added') {
                    this.textContent = 'Unlike';
                } else if (data.message === 'like removed') {
                    this.textContent = 'Like';
                }
                const likesCount = document.querySelector(`.like_count_${post_id}`);
                likesCount.textContent = data.likes_count;
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });

    save.addEventListener('click', function(){

        
        let post_id = this.value

        let text = document.querySelector(`#new_text`).value
        let content = document.querySelector(`#content_${post_id}`)
        let editedDate = document.querySelector(`#edited_date_${post_id}`)

        let updatedDateTime = new Date();  
        let formattedDateTime = updatedDateTime.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });

        fetch(`/edit_posts/${post_id}`, {
        method: 'POST',
        headers: {"Content-type": "application/json", "X-CSRFToken": getCookie("csrftoken")},
        body: JSON.stringify({
            text: text,
            updated: formattedDateTime
        }),

        })
        .then(response => response.json())
        .then(result => {
            content.innerHTML = result.text, 
            editedDate.innerHTML = result.edited
        })

    })
})