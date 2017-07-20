YUI.add("moodle-atto_recordrtc-recording",function(e,t){M.atto_recordrtc=M.atto_recordrtc||{},M.atto_recordrtc.commonmodule={player:null,startStopBtn:null,uploadBtn:null,countdownSeconds:null,countdownTicker:null,recType:null,mediaRecorder:null,chunks:null,blobSize:null,olderMoodle:null,maxUploadSize:null,check_secure:function(){var e=window.location.protocol==="https:"||window.location.host.indexOf("localhost")!==-1;e||window.alert(M.util.get_string("insecurealert","atto_recordrtc"))},check_browser:function(){if(!(bowser.firefox&&bowser.version>=29||bowser.chrome&&bowser.version>=49||bowser.opera&&bowser.version>=36)){var e=document.querySelector("div[id=alert-warning]");e.parentElement.parentElement.classList.remove("hide")}},capture_user_media:function(e,t,n){navigator.mediaDevices.getUserMedia(e).then(t).catch(n)},handle_data_available:function(e){blobSize+=e.data.size,blobSize>=maxUploadSize&&!localStorage.getItem("alerted")?(localStorage.setItem("alerted","true"),startStopBtn.click(),window.alert(M.util.get_string("nearingmaxsize","atto_recordrtc"))):blobSize>=maxUploadSize&&localStorage.getItem("alerted")==="true"?localStorage.removeItem("alerted"):chunks.push(e.data)},start_recording:function(e,t){var n=null;e==="audio"?MediaRecorder.isTypeSupported("audio/webm;codecs=opus")?n={audioBitsPerSecond:M.atto_recordrtc.params.audiobitrate,mimeType:"audio/webm;codecs=opus"}:MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")&&(n={audioBitsPerSecond:M.atto_recordrtc.params.audiobitrate,mimeType:"audio/ogg;codecs=opus"}):MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")?n={audioBitsPerSecond:M.atto_recordrtc.params.audiobitrate,videoBitsPerSecond:M.atto_recordrtc.params.videobitrate,mimeType:"video/webm;codecs=vp9,opus"}:MediaRecorder.isTypeSupported("video/webm;codecs=h264,opus")?n={audioBitsPerSecond:M.atto_recordrtc.params.audiobitrate,videoBitsPerSecond:M.atto_recordrtc.params.videobitrate,mimeType:"video/webm;codecs=h264,opus"}:MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")&&(n={audioBitsPerSecond:M.atto_recordrtc.params.audiobitrate,videoBitsPerSecond:M.atto_recordrtc.params.videobitrate,mimeType:"video/webm;codecs=vp8,opus"}),mediaRecorder=n?new MediaRecorder(t):new MediaRecorder(t,n),mediaRecorder.ondataavailable=this.handle_data_available,mediaRecorder.start(1e3),player.muted=!0,countdownSeconds=M.atto_recordrtc.params.timelimit,countdownSeconds++,startStopBtn.innerHTML=M.util.get_string("stoprecording","atto_recordrtc")+' (<span id="minutes"></span>:<span id="seconds"></span>)',this.set_time(),countdownTicker=setInterval(this.set_time,1e3),startStopBtn.disabled=!1},upload_to_server:function(e,t){var n=new XMLHttpRequest;n.open("GET",player.src,!0),n.responseType="blob",n.onload=function(){if(n.status===200){var r=this.response,i=(Math.random()*1e3).toString().replace(".","");e==="audio"?i+="-audio.ogg":i+="-video.webm";var s=new FormData;s.append("contextid",M.atto_recordrtc.params.contextid),s.append("sesskey",M.atto_recordrtc.params.sesskey),s.append(e+"-filename",i),s.append(e+"-blob",r),this.make_xmlhttprequest("save.php",s,function(e,n){if(e==="upload-ended"){var r=location.href.replace(location.href.split("/").pop(),"")+"uploads.php/";t("ended",r+n)}else t(e)})}},n.send()},make_xmlhttprequest:function(e,t,n){var r=new XMLHttpRequest;r.onreadystatechange=function(){r.readyState===4&&r.status===200?n("upload-ended",r.responseText):r.status===404&&n("upload-failed-404")},r.upload.onprogress=function(e){n(Math.round(e.loaded/e.total*100)+"% "+M.util.get_string("uploadprogress","atto_recordrtc"))},r.upload.onerror=function(e){n("upload-failed",e)},r.upload.onabort=function(e){n("upload-aborted",e)},r.open("POST",e),r.send(t)},pad:function(e){var t=e+"";return t.length<2?"0"+t:t},set_time:function(){countdownSeconds--,startStopBtn.querySelector("span#seconds").textContent=this.pad(countdownSeconds%60),startStopBtn.querySelector("span#minutes").textContent=this.pad(parseInt(countdownSeconds/60)),countdownSeconds===0&&startStopBtn.click()},create_annotation:function(e,t){var n=window.prompt(M.util.get_string("annotationprompt","atto_recordrtc"),M.util.get_string("annotation:"+e,"atto_recordrtc"));if(!n)return undefined;var r='<div id="recordrtc_annotation" class="text-center"><a target="_blank" href="'+t+'">'+n+"</a></div>";return r},insert_annotation:function(e,t){var n=this.create_annotation(e,t);n||(uploadBtn.textContent=M.util.get_string("attachrecording","atto_recordrtc"))}},M.atto_recordrtc=M.atto_recordrtc||{},M.atto_recordrtc.audiomodule={init:function(){player=document.querySelector("audio#player"),startStopBtn=document.querySelector("button#start-stop"),uploadBtn=document.querySelector("button#upload"),recType="audio",olderMoodle=M.atto_recordrtc.params.oldermoodle,maxUploadSize=parseInt(M.atto_recordrtc.params.maxrecsize.match(/\d+/)[0])*Math.pow(1024,2),M.atto_recordrtc.commonmodule.check_secure(),M.atto_recordrtc.commonmodule.check_browser(),startStopBtn.onclick=function(){var e=this;e.disabled=!0;if(e.textContent===M.util.get_string("startrecording","atto_recordrtc")||e.textContent===M.util.get_string("recordagain","atto_recordrtc")||e.textContent===M.util.get_string("recordingfailed","atto_recordrtc")){var t=document.querySelector("div[id=alert-danger]");t.parentElement.parentElement.classList.add("hide"),player.parentElement.parentElement.classList.add("hide"),uploadBtn.parentElement.parentElement.classList.add("hide"),M.atto_recordrtc.oldermoodle||(startStopBtn.classList.remove("btn-outline-danger"),startStopBtn.classList.add("btn-danger")),chunks=[],blobSize=0;var n={onMediaCaptured:function(t){e.stream=t,e.mediaCapturedCallback&&e.mediaCapturedCallback()},onMediaStopped:function(t){e.textContent=t},onMediaCapturingFailed:function(e){var t=null;if(e.name==="PermissionDeniedError"&&bowser.firefox)InstallTrigger.install({Foo:{URL:"https://addons.mozilla.org/en-US/firefox/addon/enable-screen-capturing/",toString:function(){return this.URL}}}
),t=M.util.get_string("startrecording","atto_recordrtc");else if(e.name==="DevicesNotFoundError"||e.name==="NotFoundError"){var r=document.querySelector("div[id=alert-danger]");r.parentElement.parentElement.classList.remove("hide"),r.textContent=M.util.get_string("inputdevicealert_title","atto_recordrtc")+" "+M.util.get_string("inputdevicealert","atto_recordrtc"),t=M.util.get_string("recordingfailed","atto_recordrtc")}n.onMediaStopped(t)}};this.capture_audio(n),e.mediaCapturedCallback=function(){M.atto_recordrtc.commonmodule.start_recording(recType,e.stream)}}else clearInterval(countdownTicker),setTimeout(function(){e.disabled=!1},1e3),M.atto_recordrtc.commonmodule.stop_recording_audio(e.stream),e.textContent=M.util.get_string("recordagain","atto_recordrtc"),olderMoodle||(startStopBtn.classList.remove("btn-danger"),startStopBtn.classList.add("btn-outline-danger"))}},capture_audio:function(e){M.atto_recordrtc.commonmodule.capture_user_media({audio:!0},function(t){player.srcObject=t,e.onMediaCaptured(t)},function(t){e.onMediaCapturingFailed(t)})},stop_recording_audio:function(e){mediaRecorder.stop(),e.getTracks().forEach(function(e){e.stop()});var t=new Blob(chunks);player.src=URL.createObjectURL(t),player.muted=!1,player.controls=!0,player.parentElement.parentElement.classList.remove("hide"),uploadBtn.parentElement.parentElement.classList.remove("hide"),uploadBtn.textContent=M.util.get_string("attachrecording","atto_recordrtc"),uploadBtn.disabled=!1,uploadBtn.onclick=function(){if(!player.src||chunks===[])return window.alert(M.util.get_string("norecordingfound","atto_recordrtc"));var e=uploadBtn;return e.disabled=!0,M.atto_recordrtc.commonmodule.upload_to_server(recType,function(t,n){t==="ended"?(e.disabled=!1,M.atto_recordrtc.commonmodule.insert_annotation(recType,n)):t==="upload-failed"?(e.disabled=!1,e.textContent=M.util.get_string("uploadfailed","atto_recordrtc")+" "+n):t==="upload-failed-404"?(e.disabled=!1,e.textContent=M.util.get_string("uploadfailed404","atto_recordrtc")):t==="upload-aborted"?(e.disabled=!1,e.textContent=M.util.get_string("uploadaborted","atto_recordrtc")+" "+n):e.textContent=t}),undefined}}},M.atto_recordrtc=M.atto_recordrtc||{},M.atto_recordrtc.videomodule={init:function(){player=document.querySelector("video#player"),startStopBtn=document.querySelector("button#start-stop"),uploadBtn=document.querySelector("button#upload"),recType="video",olderMoodle=M.atto_recordrtc.params.oldermoodle,maxUploadSize=parseInt(M.atto_recordrtc.params.maxrecsize.match(/\d+/)[0])*Math.pow(1024,2),e.M.atto_recordrtc.check_secure(),e.M.atto_recordrtc.check_browser(),startStopBtn.onclick=function(){var t=this;t.disabled=!0;if(t.textContent===M.util.get_string("startrecording","atto_recordrtc")||t.textContent===M.util.get_string("recordagain","atto_recordrtc")||t.textContent===M.util.get_string("recordingfailed","atto_recordrtc")){var n=document.querySelector("div[id=alert-danger]");n.parentElement.parentElement.classList.add("hide"),uploadBtn.parentElement.parentElement.classList.add("hide"),olderMoodle||(startStopBtn.classList.remove("btn-outline-danger"),startStopBtn.classList.add("btn-danger")),chunks=[],blobSize=0;var r={onMediaCaptured:function(e){t.stream=e,t.mediaCapturedCallback&&t.mediaCapturedCallback()},onMediaStopped:function(e){t.textContent=e},onMediaCapturingFailed:function(e){var t=null;if(e.name==="PermissionDeniedError"&&bowser.firefox)InstallTrigger.install({Foo:{URL:"https://addons.mozilla.org/en-US/firefox/addon/enable-screen-capturing/",toString:function(){return this.URL}}}),t=M.util.get_string("startrecording","atto_recordrtc");else if(e.name==="DevicesNotFoundError"||e.name==="NotFoundError"){var n=document.querySelector("div[id=alert-danger]");n.parentElement.parentElement.classList.remove("hide"),n.textContent=M.util.get_string("inputdevicealert","atto_recordrtc")+" "+M.util.get_string("inputdevicealert","atto_recordrtc"),t=M.util.get_string("recordingfailed","atto_recordrtc")}r.onMediaStopped(t)}};player.parentElement.parentElement.classList.remove("hide"),player.controls=!1,e.M.atto_recordrtc.capture_audio_video(r),t.mediaCapturedCallback=function(){e.M.atto_recordrtc.start_recording(recType,t.stream)}}else clearInterval(countdownTicker),setTimeout(function(){t.disabled=!1},1e3),e.M.atto_recordrtc.stop_recording_video(t.stream),t.textContent=M.util.get_string("recordagain","atto_recordrtc"),olderMoodle||(startStopBtn.classList.remove("btn-danger"),startStopBtn.classList.add("btn-outline-danger"))}},capture_audio_video:function(t){e.M.atto_recordrtc.capture_user_media({audio:!0,video:{width:{ideal:640},height:{ideal:480}}},function(e){player.srcObject=e,player.play(),t.onMediaCaptured(e)},function(e){t.onMediaCapturingFailed(e)})},stop_recording_video:function(t){mediaRecorder.stop(),t.getTracks().forEach(function(e){e.stop()});var n=new Blob(chunks);player.src=URL.createObjectURL(n),player.muted=!1,player.controls=!0,uploadBtn.parentElement.parentElement.classList.remove("hide"),uploadBtn.textContent=M.util.get_string("attachrecording","atto_recordrtc"),uploadBtn.disabled=!1,uploadBtn.onclick=function(){if(!player.src||chunks===[])return window.alert(M.util.get_string("norecordingfound","atto_recordrtc"));var t=uploadBtn;return t.disabled=!0,e.M.atto_recordrtc.upload_to_server(recType,function(n,r){n==="ended"?(t.disabled=!1,e.M.atto_recordrtc.insert_annotation(recType,r)):n==="upload-failed"?(t.disabled=!1,t.textContent=M.util.get_string("uploadfailed","atto_recordrtc")+" "+r):n==="upload-failed-404"?(t.disabled=!1,t.textContent=M.util.get_string("uploadfailed404","atto_recordrtc")):n==="upload-aborted"?(t.disabled=!1,t.textContent=M.util.get_string("uploadaborted","atto_recordrtc")+" "+r):t.textContent=n}),undefined}}}},"@VERSION@",{requires:[]});
