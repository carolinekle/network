document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#edits').addEventListener('click', save_edits);

    function save_edits(event){

        text=document.querySelector('#new_text').value
        event.preventDefault();
        fetch('/edit_posts', {
        method: 'PUT',
        body: JSON.stringify({
            text: text
        })
        })
        .then(response => response.json())
        .then(result => {
            console.log(text);
        });

    }
})