document.getElementById("startRecord").addEventListener("click", startRecording);
document.getElementById("stopRecord").addEventListener("click", stopRecording);

let mediaRecorder;
let audioChunks = [];

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });

            document.getElementById("startRecord").disabled = true;
            document.getElementById("stopRecord").disabled = false;
        });
}

function stopRecording() {
    mediaRecorder.stop();
    document.getElementById("startRecord").disabled = false;
    document.getElementById("stopRecord").disabled = true;

    mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        document.getElementById("audio").src = audioUrl;

        // 发送到服务器
        const formData = new FormData();
        formData.append("audio", audioBlob);

        fetch("/transcribe", { method: "POST", body: formData })
            .then(response => response.json())
            .then(data => {
                console.log(data); // 处理返回的转录文本
            });
    });
}