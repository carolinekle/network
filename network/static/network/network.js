document.querySelector('.save').addEventListener('click', save_edits);

function save_edits(event){
    text=document.querySelector('#new_text').value
    event.preventDefault();
     fetch('/edit_posts', {
      method: 'POST',
      body: JSON.stringify({
          text: text
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
        load_mailbox(sent)
    });
  
}