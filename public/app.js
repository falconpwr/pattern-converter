const socket = io();

document.getElementById('uploadBtn').onclick = async () => {
  const file = document.getElementById('fileInput').files[0];

  const fromPage = document.getElementById('fromPage').value;
  const toPage = document.getElementById('toPage').value;

  const legendFrom = document.getElementById('legendFrom').value;
  const legendTo = document.getElementById('legendTo').value;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('fromPage', fromPage);
  formData.append('toPage', toPage);
  formData.append('legendFrom', legendFrom);
  formData.append('legendTo', legendTo);

  await fetch('/upload', {
    method: 'POST',
    body: formData
  });
};

socket.on('progress', (data) => {
  document.getElementById('progress').innerText = data + '%';
});
