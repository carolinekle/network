


document.addEventListener('DOMContentLoaded', function() {

    const save = document.querySelectorAll('#edit')
    const likeButtons = document.querySelectorAll('#like')
    const followButton = document.querySelector('#follow')
    const deleteButtons = document.querySelectorAll('#delete')


    function getCookie(name){
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if(parts.length == 2) return parts.pop().split(';').shift();
    }

    if(deleteButtons){
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function(){
            let post_id = this.value 

            fetch(`delete_post/${post_id}`)
            .then(response => response.json())
            .then(result => {
                if(result.message === "post deleted"){
                    let toRemove = document.querySelector(`.post_${post_id}`);
                    toRemove.style.animationPlayState = 'running'; 
                    toRemove.addEventListener('animationend', () => {
                        toRemove.remove()
                    });
                }
                else{
                    alert("Something has gone wrong. Contact your administrator")
                }
            })
        })
    })
}

    function followStatus() {
        let post_poster = followButton.value;
        fetch(`/follow_status/${post_poster}`)
            .then(response => response.json())
            .then(result => {
                if (result.following) {
                    followButton.innerHTML = 'Unfollow'
                } else {
                    followButton.innerHTML = 'Follow'
                }
            })
            .catch(error => {
                console.error('Error fetching follow status:', error);
            });
    }

    window.addEventListener('load', followStatus);



    if(followButton){

    followButton.addEventListener('click', () => {
        let post_poster = followButton.value
        let followCountElement = document.querySelector('#follower-count')
        let followCount = parseInt(followCountElement.innerHTML)
        fetch(`/follow/${post_poster}`, {
            method: 'POST',
            headers: {"Content-type": "application/json", "X-CSRFToken": getCookie("csrftoken")},
            body: JSON.stringify({
                post_poster: post_poster
            }),
            
        })
        .then(response => response.json())
        .then(result => {

            if (result.message === 'followed') {
                followButton.innerHTML = 'Unfollow'
                followCount += 1
                followCountElement.innerHTML = followCount

            } else if (result.message === 'unfollowed') {
                followButton.innerHTML = 'Follow'
                followCount -= 1
                followCountElement.innerHTML = followCount 
            }
        })

    })
}

    if(likeButtons){

    function likeStatus(post_id) {
        let icon = document.querySelector(`.heart_${post_id}`);
        console.log("heard")
        fetch(`/like_status/${post_id}`)
            .then(response => response.json())
            .then(result => {
                if (result.liked) {
                    icon.classList.toggle('active');
                }
            })
            .catch(error => {
                console.error('Error fetching like status:', error);
            });
    }
    
    likeButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            let post_id = this.getAttribute("data-post-id");
            fetch(`/like/${post_id}`, {
                method: 'POST',
                headers: {"Content-type": "application/json", "X-CSRFToken": getCookie("csrftoken")},
                body: JSON.stringify({
                    post_liked: post_id
                }),
            })
            .then(response => response.json())
            .then(result => {
                let icon = document.querySelector(`.heart_${post_id}`)
                let countElement = document.querySelector(`.like_count_${post_id}`)
                let count = parseInt(countElement.innerHTML)
                if (result.message === 'like added') {
                    icon.classList.toggle('active');
                    count += 1
                    countElement.innerHTML=count
                } else if (result.message === 'like removed') {
                    icon.classList.toggle('active');
                    count -= 1
                    countElement.innerHTML=count
                }
            })
            .catch(error => {
                console.error('Error liking/unliking:', error);
            });
        });
    });

    
    likeButtons.forEach(btn => {
        let post_id = btn.getAttribute("data-post-id")
        likeStatus(post_id)
    });
    }

    if(save){

    save.forEach(btn => {
    btn.addEventListener('click', function(){
        let post_id = this.value
        console.log("heard")
        let text = document.querySelector(`#new_text_${post_id}`).value
        let content = document.querySelector(`#content_${post_id}`)
        let editedDate = document.querySelector(`.edited_${post_id}`)
        
        fetch(`/edit_posts/${post_id}`, {
        method: 'POST',
        headers: {"Content-type": "application/json", "X-CSRFToken": getCookie("csrftoken")},
        body: JSON.stringify({
            text: text
        }),

        })
        .then(response => response.json())
        .then(result => {
            if (content && editedDate) { 
                content.innerHTML = result.text;
                let updatedDate = new Date(result.updated);
                let formattedDate = updatedDate.toLocaleString('en-US');
                editedDate.innerHTML = `Updated on ${formattedDate}`;
            } else {
                console.error("Content or editedDate element is null.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });

    })

})
}
})