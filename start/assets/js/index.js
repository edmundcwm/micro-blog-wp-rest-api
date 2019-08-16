const url         = 'http://localhost:8888/restapi/wp-json/wp/v2/posts'; //this should be changed to your site
const spinner     = '<img class="spinner" width="70" src="./assets/images/ajax-loader.gif" />';
const body        = $('body');
const fetchPost   = $('#fetch-post');
const postContent = $('.post-content');
const form        = $('#post-submit-form');

/* EVENT HANDLERS -------------------- */

//handle character remaining counter
body.on('input', '.post-content', handleInput)

//Fetch posts
fetchPost.on('click', fetchPosts);

//Submit Post
form.on('submit', submitPost);

//Delete Post
body.on('click', '.delete-post', deletePost);
    
//Update Post
body.on('click', '.edit-save-post', updatePost);

//Cancel Edit
body.on('click', '.cancel-edit', cancelEdit);

/* FUNCTIONS -------------------- */

//update character remaining text on input
function handleInput() {
    //remaining characters allowed    
    let remaining = calculateCharsRemaining($(this));
    
    if ( remaining < 0 ) {
        return false;
    }

    $(this).siblings('.content-counter').html(`${remaining} characters remaining`);
}

//fetch all posts via the WP REST API
function fetchPosts() {
    const wrapper = $('.post-wrapper');
    
    //clear posts list
    wrapper.empty();

    //insert spinner
    wrapper.append(spinner);

    /********************************************
     * TO-DO 1: Insert AJAX call to RETRIEVE post
     * https://api.jquery.com/jquery.ajax/
     ********************************************/
}

//submit a new post via the WP REST API
function submitPost(e) {
    e.preventDefault();

    const contentArea = $(this).find($('.post-content'));
    
    if ( ! contentArea.val() ) {
        contentArea.addClass('input-alert');
        return;
    }
    
    //remove success message
    $('.notification').remove();

    //disable textarea when submitting
    contentArea.prop('disabled', true);
    
    //disable publish button when submitting
    $('#publish-post').prop('disabled', true);

    let postData = {
        "title" : `${postContent.val().slice(0, 10)}...`,
        "content" : postContent.val(),
        "status" : "publish"
    }

    /******************************************
     * TO-DO 2: Insert AJAX call to CREATE post
     * https://api.jquery.com/jquery.ajax/
     ******************************************/
}

//delete post via the WP REST API
function deletePost() {
    const confirmation = confirm('Are you sure you want to delete this post?');

    if ( confirmation ) {
        const postID = $(this).data('id');

        /******************************************
         * TO-DO 3: Insert AJAX call to DELETE post
         * https://api.jquery.com/jquery.ajax/
         ******************************************/
    }
}

//update post via the WP REST API
function updatePost() {
    if ( ! $(this).hasClass('edit-mode') ) {
        //Edit mode
        $(this).text('Save');
        $(this).siblings('.cancel-edit').show();
        $(this).addClass('edit-mode');

        const content = $(this).parents('.user-controls').siblings('.user-content').find('p');
        
        convertToEditable(content);
    } else {
        //Save mode
        const newContentTextArea = $(this).parents('.user-controls').siblings('.user-content').find('textarea');
        const postData = {
            "title": newContentTextArea.val(),
            "content": newContentTextArea.val(),
        }

        const postID = $(this).data('id');

        //cache the edit button
        const that = $(this);
        
        if ( ! newContentTextArea.val() ) {
            newContentTextArea.addClass('input-alert');
            return;
        }

        //disable textarea
        newContentTextArea.prop('disabled', true);

        /******************************************
         * TO-DO 4: Insert AJAX call to UPDATE post
         * https://api.jquery.com/jquery.ajax/
         ******************************************/
    } 
}

//cancel the editing of post. This converts the editable textarea back to static text
function cancelEdit() {
    const content = $(this).parents('.user-controls').siblings('.user-content').find('textarea');
    $(this).hide();
    $(this).parents('.user-controls').siblings('.user-content').find('.content-counter').remove();
    $(this).siblings('.edit-save-post').removeClass('edit-mode').text('Edit');
    convertToUneditable(content);
}

//render individual post display
function renderPost(posts) {
    let postListing = '';
    posts.forEach(post => {
        postListing += 
            `<div class="post uk-background-default uk-padding-small uk-margin-bottom">
                <article>
                    <div class="user-info uk-flex uk-flex-middle">
                        <span class="user-info__pic uk-height-1-1 uk-margin-small-right" uk-icon="icon: user; ratio: 1.5"></span>
                        <p class="uk-text-small uk-text-bold uk-text-emphasis">Edmund</p>
                    </div>
                    <div class="user-content">
                        ${post.content.rendered}
                    </div>
                    <hr />
                    <div class="user-controls">
                        <span class="uk-text-small user-controls__btn delete-post" data-id=${post.id}>Delete</span>
                        <span class="uk-text-small user-controls__btn edit-save-post" data-id=${post.id}>Edit</span>
                        <span class="uk-text-small user-controls__btn cancel-edit is-inactive" data-id=${post.id}>Cancel</span>
                        
                    </div>
                </article>
            </div>`;
    });

    return postListing;
}

//converts static text to a textarea
function convertToEditable(content) {;
    const editContent =`
        <textarea class="content-area post-content uk-textarea" maxlength="280">${content.html()}</textarea>
        <p class="uk-text-small content-counter"></p>
        `;
    content.replaceWith(editContent);
}

//converts textarea back to static text
function convertToUneditable(content) {
    const uneditedContent = `<p>${content.html()}</p>`;
    content.replaceWith(uneditedContent);
}

// calculates and returns the number of characters remaining based on a limit
function calculateCharsRemaining(input) {
    const maxLength = input.prop('maxLength');
    const charsRemaining = maxLength - input.val().length;

    return charsRemaining;
}

fetchPosts();