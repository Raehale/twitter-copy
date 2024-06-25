import { tweetsData } from './data.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
        handleLikeClick(e.target.dataset.like);
    } else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet);
    } else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply);
    } else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick();
    } else if(e.target.dataset.replyIcon){
        handleReplySubmitClick(e.target.dataset.replyIcon);
    }
});

function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId;
    })[0];

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--;
    } else{
        targetTweetObj.likes++;
    }

    targetTweetObj.isLiked = !targetTweetObj.isLiked;
    render();
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId;
    })[0];

    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--;
    } else{
        targetTweetObj.retweets++;
    }

    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
    render();
}

function handleReplyClick(replyId){
    const allRepliesArray = document.getElementsByClassName('tweet-replies');
    let repliesId = document.getElementById(`replies-${replyId}`);

    for (let reply of allRepliesArray) {
        if (reply.id !== `replies-${replyId}`){
            reply.classList.add('hidden');
        }
    }

    repliesId.classList.toggle('hidden');
}

function handleReplySubmitClick(replyId){
    const replyInput = document.getElementById(`reply-input-${replyId}`);

    if(replyInput.value){

        const targetTweetObj = tweetsData.filter(function(tweet){
            return tweet.uuid === replyId;
        })[0];

        targetTweetObj.replies.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: `${replyInput.value}`,
        });

        let repliesId = document.getElementById(`replies-${replyId}`);
        repliesId.classList.remove('hidden');

        getRepliesHtml(targetTweetObj);
        replyInput.value = '';
    }
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input');

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4(),
        });

        render();
        tweetInput.value = '';
    }

}

function getRepliesHtml(tweet){
    let repliesHtml = '';
    if(tweet.replies.length > 0){
        tweet.replies.forEach(function(reply){
            return repliesHtml += `<div class="tweet-reply">
                                        <div class="tweet-inner">
                                            <img src="${reply.profilePic}" class="profile-pic">
                                            <div>
                                                <p class="handle">${reply.handle}</p>
                                                <p class="tweet-text">${reply.tweetText}</p>
                                            </div>
                                        </div>
                                    </div>`;
        });
    }
    let repliesId = document.getElementById(`submited-replies-${tweet.uuid}`);
    repliesId.innerHTML = repliesHtml;
}

function getFeedHtml(){
    let feedHtml = ``;

    tweetsData.forEach(function(tweet){

        let likeIconClass = '';
        if (tweet.isLiked){
            likeIconClass = 'liked';
        }

        let retweetIconClass = '';
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted';
        }

        feedHtml += `<div class="tweet" id="tweet-${tweet.uuid}">
                        <div class="tweet-inner">
                            <img src="${tweet.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle" id="handle-${tweet.uuid}">${tweet.handle}</p>
                                <p class="tweet-text">${tweet.tweetText}</p>
                                <div class="tweet-details">
                                    <span class="tweet-detail">
                                        <i class="fa-regular fa-comment-dots"
                                        data-reply="${tweet.uuid}"
                                        ></i>
                                        ${tweet.replies.length}
                                    </span>
                                    <span class="tweet-detail">
                                        <i class="fa-solid fa-heart ${likeIconClass}"
                                        data-like="${tweet.uuid}"
                                        ></i>
                                        ${tweet.likes}
                                    </span>
                                    <span class="tweet-detail">
                                        <i class="fa-solid fa-retweet ${retweetIconClass}"
                                        data-retweet="${tweet.uuid}"
                                        ></i>
                                        ${tweet.retweets}
                                    </span>
                                </div>   
                            </div>            
                        </div>
                        <div class="hidden tweet-replies" id="replies-${tweet.uuid}">
                            <div id="submited-replies-${tweet.uuid}">
                                <div class="tweet-reply">
                                    <div class="tweet-inner">
                                        <img src="${tweet.profilePic}" class="profile-pic">
                                        <div>
                                            <p class="handle">${tweet.handle}</p>
                                            <p class="tweet-text">${tweet.tweetText}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <form id="reply-form-${tweet.uuid}" class="reply-form">
                                <textarea placeholder="Reply to ${tweet.handle}" 
                                    class="reply-textarea"
                                    id="reply-input-${tweet.uuid}"></textarea>
                                <button type="button" class="reply-button">
                                        <i class="fa-solid fa-reply"
                                        data-reply-icon="${tweet.uuid}"></i>
                                </button>
                            </form>
                        </div>
                    </div>`;
    });

    return feedHtml;
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml();
}

render();

// add ability to log in
// add ability to sign up
// add ability to add to local Storage