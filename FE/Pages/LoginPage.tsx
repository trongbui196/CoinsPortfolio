import { useState } from "react";
import { useDispatch } from "react-redux";
import baseurl from "../baseurl";
import { setUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Get userid from Redux state
  const [isRegister, setIsRegister] = useState(false);
  const [LoginformData, setLoginFormData] = useState({
    username: "trongbui123",
    password: "123abc",
  });
  const [RegisterformData, setRegisterFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    phonenumber: "",
    birthDay: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginFormData({ ...LoginformData, [name]: value });
  };

  const handleRegisterInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setRegisterFormData({ ...RegisterformData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isRegister ? "/api/User/Register" : "/api/User/Login";
    const data = isRegister ? RegisterformData : LoginformData;
    try {
      const response = await baseurl.post(url, data);
      if (!isRegister && response.data.id && response.data.accessToken) {
        dispatch(
          setUser({
            userid: response.data.id,
            accessToken: response.data.accessToken,
          })
        );

        navigate(`/market`);
        setErrorMessage(""); // Clear any previous error message
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Login failed. Please check your credentials."); // Set error message
    }
  };

  return (
    <div className="flex">
      <div className="w-1/2 bg-gray-100 flex flex-col justify-center items-center">
        <div className={`w-full max-w-sm ${isRegister ? "opacity-50" : ""}`}>
          <h2 className="text-3xl font-bold mb-4">
            {isRegister ? "Register" : "Login"}
          </h2>
          {errorMessage && ( // Render error message if it exists
            <div className="mb-4 text-red-500">{errorMessage}</div>
          )}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={LoginformData.username}
                onChange={handleLoginInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={LoginformData.password}
                onChange={handleLoginInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              {isRegister ? "Register" : "Login"}
            </button>
          </form>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <button
          onClick={() => setIsRegister((prevState) => !prevState)}
          className="bg-orange-500 border-black text-white px-4 py-2 rounded"
        >
          Switch
        </button>
      </div>

      <div className="w-1/2 bg-orange-300 flex flex-col justify-center items-center text-white">
        <div className={`w-full max-w-sm ${!isRegister ? "opacity-50" : ""}`}>
          <h2 className="text-3xl font-bold mb-4">Register</h2>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label className="block text-gray-700">First name</label>
              <input
                type="text"
                name="firstName"
                value={RegisterformData.firstName}
                onChange={handleRegisterInputChange}
                className="w-full px-3 py-2 border rounded text-black"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Last name</label>
              <input
                type="text"
                name="lastName"
                value={RegisterformData.lastName}
                onChange={handleRegisterInputChange}
                className="w-full px-3 py-2 border rounded text-black"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                name="userName"
                value={RegisterformData.userName}
                onChange={handleRegisterInputChange}
                className="w-full px-3 py-2 border rounded text-black"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="text"
                name="email"
                value={RegisterformData.email}
                onChange={handleRegisterInputChange}
                className="w-full px-3 py-2 border rounded text-black"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phonenumber"
                value={RegisterformData.phonenumber}
                onChange={handleRegisterInputChange}
                className="w-full px-3 py-2 border rounded text-black"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={RegisterformData.password}
                onChange={handleRegisterInputChange}
                className="w-full px-3 py-2 border rounded text-black"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-orange-500 py-2 rounded"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
