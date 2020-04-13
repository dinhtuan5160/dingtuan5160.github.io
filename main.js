const socket = io("https://callvideo13042020.herokuapp.com/");
$('#videos').hide();
socket.on('hien_thi',data =>{
    $('#videos').show();
    $('#signup').hide();
});

socket.on('add_user',function (data) {
        $('#ulUser').append("<li id= " + data.peerId + " class ='liUser'>"  + data.ten + "</li>");
})

socket.on('danh_sach',function (data) {
    for(var i =0; i<data.length;i++){
        $('#ulUser').append("<li id= " + data[i].peerId + " class ='liUser'>"  + data[i].ten + "</li>");
    }
})

$(document).on('click','.liUser',function () {
    openStream().then(stream =>{
        playStream('localStream',stream);
        const call = peer.call($(this).attr('id'),stream);
        call.on('stream',remoteStream =>{
            playStream('remoteStream',remoteStream);
        })


    })
    socket.emit('send_peerId',$(this).attr('id'))
})
socket.on('huy_ket_noi',function (peerId) {
    $('#'+peerId).remove();
})
$('#btnCancelVideo').click(function () {
    socket.emit('huy_goi');
})
socket.on('huy_tat_ca',() =>{
    $('#videos').hide();
    $('#signup').show();
})

function openStream(){
    const config = {audio : false , video : true};
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideo,stream) {
    var video = document.getElementById(idVideo);
    video.srcObject = stream;
    video.play();

}

// openStream().then(stream =>{
//     playStream('localStream',stream);
// })
var peer = new Peer({key: 'lwjd5qra8257b9'})

//khi nao connect to server
peer.on('open', function(id) {
    // $('#idPeer').append(id);
    $('#btnSignUp').click(function () {
        var username = $('#txtUsername').val();
        socket.emit('dang_ky',{ten : username,peerId : id});
    })
});

//nguoi goi
// $('#btnCall').click(function () {
//     var id = $('#remoteId').val();
//     openStream().then(stream =>{
//         playStream('localStream',stream);
//         const call = peer.call(id,stream);
//         call.on('stream',remoteStream =>{
//             playStream('remoteStream',stream);
//         })
//     })
//
// })
peer.on('call',call=>{
    openStream().then(stream =>{
        playStream('localStream',stream);
        call.answer(stream);
        call.on('stream',remoteStream =>{
            playStream('remoteStream',remoteStream);
        })
    })
})



