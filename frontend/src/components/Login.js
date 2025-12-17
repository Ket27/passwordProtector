import { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { useNavigate} from "react-router-dom";
import axios from "axios";

const Login = ({ authChange, setDetails }) => {
  const navigate = useNavigate()
  const [state, setState] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading,setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.password) {
      console.log("fill all details");
    }
    try {
      setLoading(true);
      const data = await axios.post(
        "http://localhost:8000/login",
        { username: formData.username, password: formData.password },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );

      if (data.data.message === "User loggedin successfully") {
        setDetails((prev) => ({
          ...prev,
          access_token: data.data.access_token,
          user_id: data.data.user_id,
          master_password: data.data.password,
          salt: data.data.salt,
        }));
        localStorage.setItem("user", data.data.access_token);
        setLoading(false);
        navigate("/passwords")
      }
    } catch (err) {
      throw err;
    }
  };

  const handleKeyPressed = (e) => {
    if(e.key === "Enter") handleSubmit();
  } 

  return (
    <>
      <div className="flex justify-center">
        <div className="h-[90%] w-full md:w-3/4 m-4">
          <div className="text-xl cursor-pointer flex flex-col justify-center items-center mt-5 md:mt-0">
            <h1 className="font-semibold text-3xl text-gray-700 m-2">Log In</h1>
            {/* <div className="flex">
              <ion-icon
                name="logo-google"
                className="py-2 rounded px-4 border-2 m-1 cursor-pointer border-violet-600 text-white bg-violet-600 hover:bg-white hover:text-violet-600 text-2xl"
              ></ion-icon>
              <ion-icon
                name="logo-facebook"
                className="py-2 rounded px-4 border-2 m-1 cursor-pointer border-blue-500 bg-blue-500 text-white hover:bg-white hover:text-blue-500 text-2xl"
              ></ion-icon>
            </div> */}
            {/* <div className="text-gray-700 font-semibold"> or </div> */}
          </div>
          <div className="flex flex-col justify-center items-center mt-10 md:mt-4 space-y-6 md:space-y-8" onKeyDown={(e) => handleKeyPressed(e)}>
            <div className="">
              <input
                type="text"
                placeholder="Email/Username"
                name="username"
                value={formData.username}
                onChange={(e) => handleChange(e)}
                className=" bg-gray-100 rounded-lg px-5 py-2 focus:border border-violet-600 focus:outline-none text-black placeholder:text-gray-600 placeholder:opacity-50 font-semibold md:w-72 lg:w-[340px]"
              />
            </div>
            <div className="relative">
              <input
                type={state === true ? "password" : "text"}
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={(e) => handleChange(e)}
                className=" bg-gray-100 rounded-lg px-5 py-2 focus:border border-violet-600 focus:outline-none text-black placeholder:text-gray-600 placeholder:opacity-50 font-semibold md:w-72 lg:w-[340px]"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                onClick={() => setState((prev) => (prev = !prev))}
              >
                {state && <IoEyeOutline />}
                {!state && <IoEyeOffOutline />}
              </span>
            </div>
            <div className="flex space-x-2 -ml-28 md:-ml-40  lg:-ml-52">
              <input
                className=""
                type="checkbox"
                id="checkbox"
                name="checkbox"
              />
              <h3 className="text-sm font-semibold text-gray-400 -mt-1 cursor-pointer">
                Remember Me
              </h3>
            </div>
          </div>
          <div className="text-center mt-7">
            <button
              type="button"
              className="uppercase px-24 md:px-[118px] lg:px-[140px] py-2 rounded-md text-white bg-violet-500 hover:bg-violet-600  font-medium "
              onClick={handleSubmit}
            >
              {loading ? "Logging ..." : "Login"}
            </button>
          </div>
          <div className="text-center my-6 flex flex-col">
            <div className="text-sm font-medium text-gray-400 hover:text-violet-500 m-1 cursor-pointer">
              Forgot Password ?
            </div>
            <div
              className="text-sm font-bold text-gray-400 hover:text-violet-500 m-1 cursor-pointer"
              onClick={authChange}
            >
              Not a User? Create New Account
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
