import React, { useEffect, useState } from "react";
import PasswordBlock from "../components/PasswordBlock";
import AddPassword from "../components/AddPassword";
import PostPassword from "../components/PostPassword";
import DeriveKey from "../helpers/DeriveKey";
import Encrypt from "../helpers/Encrypt";
import axios from "axios";
import Decrypt from "../helpers/Decrypt";
import { useNavigate} from "react-router-dom";

const LandingPage = ({ details }) => {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccount, setNewAccount] = useState({
    accountName: "",
    password: "",
  });
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPasswords();
  }, []);
  const fetchPasswords = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("user");
      const res = await axios.get(
        `http://localhost:8000/passwords/password/${details.user_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const key = await DeriveKey(details.master_password, details.salt);
      const newData =  await Promise.all(res.data.passwords.map((encryption) => Decrypt(encryption.id,encryption.account_name,key,encryption.ciphertext,encryption.iv)));

      setPasswords(newData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching passwords:", error);
      navigate("/");
    }
  };

  const handleAddPassword = async () => {
    if (newAccount.accountName && newAccount.password) {
      const key = await DeriveKey(details.master_password, details.salt);

      const encryption = await Encrypt(key, newAccount.password);

      try {
        const token = localStorage.getItem("user");
        const data = await axios.post(
          `http://localhost:8000/passwords/password/${details.user_id}`,
          {
            accountname: newAccount.accountName,
            iv: encryption.iv,
            ciphertext: encryption.ciphertext,
          },
          {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const key = await DeriveKey(details.master_password, details.salt);
        const newData =  await Decrypt(data.data.id,data.data.account_name,key,data.data.ciphertext,data.data.iv);
        setPasswords((prev) => [...prev, newData]);
        setNewAccount({ accountName: '', password: '' });
      } catch (err) {
        throw err;
      }
    }
  };

  const handleDelete = async (id) => {
    try{
      const token = localStorage.getItem("user");
      await axios.delete(`http://localhost:8000/passwords/password/${details.user_id}?passwordId=${id}`,
        {
          headers :{
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        }
      )
      setPasswords(passwords.filter((pwd) => pwd.id !== id));
    }  
    catch (error) {
      console.error('Error deleting password:', error);
      alert('Failed to delete password. Please try again.');
    }
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-12 text-center tracking-tight">
          Password Protector
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!showAddForm ? (
            <AddPassword setShowAddForm={setShowAddForm} />
          ) : (
            <PostPassword
              newAccount={newAccount}
              setNewAccount={setNewAccount}
              handleAddPassword={handleAddPassword}
              setShowAddForm={setShowAddForm}
            />
          )}

          {passwords.length>0 && <PasswordBlock
            passwords={passwords}
            visiblePasswords={visiblePasswords}
            togglePasswordVisibility={togglePasswordVisibility}
            handleDelete={handleDelete}
            details={details}
            loading={loading}
          />}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
