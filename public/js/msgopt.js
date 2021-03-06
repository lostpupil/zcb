if(localStorage.getItem('unReadMsg') === null){
    localStorage['unReadMsg'] = JSON.stringify([]);
}else{
    }


function loadChatHis (myPeerId,otherPeerId,limit,timestamp) {
    AV.Cloud.run("CsToPeerHistory", {cus:otherPeerId,
        peers:['service1','service2','service3','service4'],
        limit:limit,
        timestamp:timestamp,
        reverse:'yes'}, {
           success: function(data){
            _.each(data,function (his) {
                var top_msg_timestamp = $('#'+otherPeerId+' li:first').data('timestamp');
                if(otherPeerId == his.from){
                    var data = {
                        msg:his.data,
                        fromPeerId:otherPeerId,
                        timestamp:his.timestamp
                    }
                    if(top_msg_timestamp !== his.timestamp){
                     prependRecvMsg(data);
                 }
             }else{
                if(top_msg_timestamp !== his.timestamp){
                    prependSendMsg(otherPeerId, JSON.parse(his.data).Content,his.timestamp);
                }
            }
        })
        }
    });
}
function addChatHis (otherPeerId) {
    AV.Cloud.run("GetChatHistory", {frompid:myPeerId,topid:otherPeerId}, {
       success: function(data){
        _.each(data,function (his) {
            if (myPeerId == his.from){
              appendSendMsg(otherPeerId, JSON.parse(his.data).Content,his.timestamp);
          }else{
            var data = {
                msg:his.data,
                fromPeerId:otherPeerId,
                timestamp:his.timestamp
            }
            appendRecvMsg(data, false);
        }
    })
    }
});
}
//append msg for init msg
function appendSendMsg(peerId, content,timestamp){
    // 这里是发送的消息append
    str = _.template($('#text-tpl').html())({
        peerId:peerId,
        content:content,
        avatar: localStorage[myPeerId+'-avatar'],
        timestamp:timestamp,
        klass:'from-me'
    });
    var elem = $(str);
    $('#'+peerId).append(elem);
    scrollToEnd(peerId);
}

function appendRecvMsg(data, addCount){
    if (typeof addCount =='undefined')
        addCount = true;
    receive_msg = JSON.parse(data.msg);


    var from_avatar = data.fromPeerId + "-avatar";
    switch(receive_msg.InfoType) {
        case "IMAGE":
        str2 = _.template($('#image-tpl').html())({
            peerId: data.fromPeerId,
            content: receive_msg.Content,
            avatar: localStorage[from_avatar] == 'undefined' ? 'img/user1.png' : localStorage[from_avatar],
            timestamp: data.timestamp,
            klass:'to-me'
        });
        $('#'+data.fromPeerId).append(str2);

        break;

        case "VOICE":

        str2 = _.template($('#voice-tpl').html())({
            peerId: data.fromPeerId,
            content: receive_msg.Content,
            avatar: localStorage[from_avatar] == 'undefined' ? 'img/user1.png' : localStorage[from_avatar],
            timestamp: data.timestamp,
            klass:'to-me'
        });

        var elem = $(str2);
        var audio = $("<audio src='"+receive_msg.Content+"' preload='auto'/>");
        audio.appendTo(elem);
        elem.appendTo($('#'+data.fromPeerId));
        audiojs.create(audio, {});

        unreadAudios = JSON.parse(localStorage['unReadMsg']);

        var li_id = data.fromPeerId+'-'+data.timestamp;
        if (_.contains(unreadAudios, li_id)){
            $('#'+li_id).addClass('unread');
            }
        break;

        case "TEXT":
        str2 = _.template($('#text-tpl').html())({
            peerId: data.fromPeerId,
            content: receive_msg.Content,
            avatar: localStorage[from_avatar] == 'undefined' ? 'img/user1.png' : localStorage[from_avatar],
            timestamp: data.timestamp,
            klass:'to-me'
        });
        $('#'+data.fromPeerId).append(str2);
        break;
    }
    if (addCount && data.fromPeerId!=toPeerId){
        var count = $('#user-'+data.fromPeerId+' .badge').html();
        count = parseInt(count) || 0;
        count += 1;
        localStorage[data.fromPeerId+'-unread'] = count;
        $('#user-'+data.fromPeerId+' .badge').html(count);
        var item = $('#user-'+data.fromPeerId)
        item.detach();
        item.prependTo('#user-list');
    }else{
        scrollToEnd(data.fromPeerId);
    }
    $('p.play').click(function(){
        var msg_id = $(this).parent().parent().parent().attr('id');
        var un_read = JSON.parse(localStorage["unReadMsg"]);
        $('#'+msg_id).removeClass('unread');
        un_read = _.without(un_read, msg_id);
        localStorage['unReadMsg'] = JSON.stringify(un_read);
        });

}
//prepend msg for load chat history

function prependSendMsg(peerId, content,timestamp){
    // 这里是发送的消息append
    str = _.template($('#text-tpl').html())({
        peerId:peerId,
        content:content,
        avatar: localStorage[myPeerId+'-avatar'],
        timestamp:timestamp,
        klass:'from-me'
    });
    var elem = $(str);
    $('#'+peerId).prepend(elem);
}

function prependRecvMsg(data){
    receive_msg = JSON.parse(data.msg);

    var from_avatar = data.fromPeerId + "-avatar";
    switch(receive_msg.InfoType) {
        case "IMAGE":
        str2 = _.template($('#image-tpl').html())({
            peerId: data.fromPeerId,
            content: receive_msg.Content,
            avatar: localStorage[from_avatar] == 'undefined' ? 'img/user1.png' : localStorage[from_avatar],
            timestamp: data.timestamp,
            klass:'to-me'
        });
        $('#'+data.fromPeerId).prepend(str2);

        break;

        case "VOICE":

        str2 = _.template($('#voice-tpl').html())({
            peerId: data.fromPeerId,
            content: receive_msg.Content,
            avatar: localStorage[from_avatar] == 'undefined' ? 'img/user1.png' : localStorage[from_avatar],
            timestamp: data.timestamp,
            klass:'to-me'
        });

        var elem = $(str2);
        var audio = $("<audio src='"+receive_msg.Content+"' preload='auto'/>");
        audio.appendTo(elem);
        elem.appendTo($('#'+data.fromPeerId));
        audiojs.create(audio, {});

        break;

        case "TEXT":

        str2 = _.template($('#text-tpl').html())({
            peerId: data.fromPeerId,
            content: receive_msg.Content,
            avatar: localStorage[from_avatar] == 'undefined' ? 'img/user1.png' : localStorage[from_avatar],
            timestamp: data.timestamp,
            klass:'to-me'
        });
        $('#'+data.fromPeerId).prepend(str2);
        break;
    }
    if (data.fromPeerId!=toPeerId){
        var count = $('#user-'+data.fromPeerId+' .badge').html();
        count = parseInt(count) || 0;
        count += 1;
        $('#user-'+data.fromPeerId+' .badge').html(count);
    }

}
