function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

const Decrypt = async (id, accountname, key, ciphertextB64, ivB64) => {
  const dec = new TextDecoder();

  // Convert base64 strings back to binary
  const ciphertext = base64ToArrayBuffer(ciphertextB64);
  const iv = base64ToArrayBuffer(ivB64);

  // Perform AES-GCM decryption
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );

  // Convert decrypted bytes back to string
  const plaintext = dec.decode(decryptedBuffer);
  return {
    id,
    accountname,
    plaintext
  }
};

export default Decrypt;