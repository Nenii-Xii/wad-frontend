// Kirim sinyal bahwa token baru saja diperbarui
window.dispatchEvent(new CustomEvent("token:refreshed", {
  detail: { token: newToken }
}));