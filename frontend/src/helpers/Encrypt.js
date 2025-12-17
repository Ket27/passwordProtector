const buf2b64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf)));

const Encrypt = async (key, sitePassword) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(sitePassword)
  );

  return {
    ciphertext: buf2b64(ciphertext),
    iv: buf2b64(iv),
    kdf: "pbkdf2",
    kdf_params: { iterations: 300000 },
  };
};

export default Encrypt;
