import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../store/userSlice"; // Import the action
import { RootState } from "../store/store";
export default function Navbar() {
  const dispatch = useDispatch();
  const userid = useSelector((state: RootState) => state.user.userid); // Get userid from Redux state
  const accesstoken = useSelector((state: RootState) => state.user.accessToken);

  const handleLogout = () => {
    dispatch(clearUser()); // Clear userid on logout
  };
  console.log(`aaaa: ${userid}, ${accesstoken}`);
  return (
    <div className="w-1/5  bg-orange-600 text-white p-5 py-16">
      <div className="text-2xl font-bold mb-5">Admin Logo</div>
      <ul className="space-y-2">
        <li>
          <Link to="/" className="hover:bg-gray-700 p-2 block rounded">
            Home
          </Link>
        </li>
        <li>
          <Link to="/users" className="hover:bg-gray-700 p-2 block rounded">
            Users
          </Link>
        </li>
        <li>
          <Link to="/coins" className="hover:bg-gray-700 p-2 block rounded">
            Coins
          </Link>
        </li>
        <li>
          <Link
            to="/transactions"
            className="hover:bg-gray-700 p-2 block rounded"
          >
            Transactions
          </Link>
        </li>
        {userid ? (
          <>
            <li onClick={() => handleLogout()}>Log out</li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className="hover:bg-gray-700 p-2 block rounded">
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
