
document.addEventListener('DOMContentLoaded', function() {

    const save = document.querySelector('#edit')
    const likeButtons = document.querySelectorAll('#like')
    const followButton = document.querySelector('#follow')
    const deleteButtons = document.querySelectorAll('#delete')

    function getCookie(name){
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if(parts.length == 2) return parts.pop().split(';').shift();
    }

    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function(){
            let post_id = this.value 
            console.log( this.value)

            fetch(`delete_post/${post_id}`)
            .then(response => response.json())
            .then(result => {
                if(result.message === "post deleted"){
                    let toRemove = document.querySelector(`.post_${post_id}`);
                    toRemove.style.animationPlayState = 'running';
                    btn.addEventListener('animationend', () => {
                        alert("Deleted!");
                    });
                }
                else{
                    alert("Something has gone wrong. Contact your administrator")
                }
            })
        })
    })

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

    followButton.addEventListener('click', () => {
        let post_poster = followButton.value
        let followCountElement = document.querySelector('#follower-count')
        let followCount = parseInt(followCountElement.innerHTML)
        console.log(post_poster + " is followed")
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
        });

    }); 

    function likeStatus(post_id) {
        let likeButton = document.querySelector(`.like_${post_id}`);
        fetch(`/like_status/${post_id}`)
            .then(response => response.json())
            .then(result => {
                if (result.liked) {
                    likeButton.innerHTML = 'Unlike'
                } else {
                    likeButton.innerHTML = 'Like'
                }
            })
            .catch(error => {
                console.error('Error fetching like status:', error);
            });
    }
    
    likeButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            let post_id = this.value;
            fetch(`/like/${post_id}`, {
                method: 'POST',
                headers: {"Content-type": "application/json", "X-CSRFToken": getCookie("csrftoken")},
                body: JSON.stringify({
                    post_liked: post_id
                }),
            })
            .then(response => response.json())
            .then(result => {
                let likeButton = document.querySelector(`.like_${post_id}`)
                let countElement = document.querySelector(`.like_count_${post_id}`)
                let count = parseInt(countElement.innerHTML)
                if (result.message === 'like added') {
                    likeButton.innerHTML = 'Unlike'
                    count += 1
                    countElement.innerHTML = count;
                } else if (result.message === 'like removed') {
                    likeButton.innerHTML = 'Like'
                    count -= 1
                    countElement.innerHTML = count
                }
            })
            .catch(error => {
                console.error('Error liking/unliking:', error);
            });
        });
    });
    
    likeButtons.forEach(btn => {
        let post_id = btn.value
        likeStatus(post_id)
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