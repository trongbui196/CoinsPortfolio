import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Modal from "../Components/Modal"; // Adjust the import path as necessary

interface Userif {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  language: string;
  currency: string;
  avatarUrl: string;
  createdAt: string;
}

export default function Transaction() {
  const [loading, setLoading] = useState(true);
  const [User, setUser] = useState<Userif[]>([]);
  const [selectedUser, setSelectedUser] = useState<Userif | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const userId = useSelector((state: RootState) => state.user.userid);
  const accesstoken = useSelector((state: RootState) => state.user.accessToken);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<Userif[]>(
          "http://localhost:5101/api/User/GetUsers"
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleEdit = (user: Userif) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleUpdateUser = async () => {
    if (selectedUser) {
      try {
        console.log(`${accesstoken}`);
        await axios.put(
          `http://localhost:5101/api/User/UpdateUser`,
          selectedUser,
          {
            headers: {
              Authorization: `Bearer ${accesstoken}`, // Add the Authorization header
            },
          }
        );
        setUser(User.map((u) => (u.id === selectedUser.id ? selectedUser : u)));
        setModalOpen(false);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h2>{userId ? `${userId}` : "Login required"}</h2>

      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr>
            <th className="border px-4 py-2 bg-gray-300">Username</th>
            <th className="border px-4 py-2 bg-gray-300">Full name</th>
            <th className="border px-4 py-2 bg-gray-300">Email</th>
            <th className="border px-4 py-2 bg-gray-300">Phone</th>
            <th className="border px-4 py-2 bg-gray-300">Created At</th>
            <th className="border px-4 py-2 bg-gray-300"></th>
          </tr>
        </thead>
        <tbody>
          {User.map((u) => (
            <tr key={u.id} className="p-4">
              <td className="border px-4 py-2">{u.userName}</td>
              <td className="border px-4 py-2">
                {u.firstName} {u.lastName}
              </td>
              <td className="border px-4 py-2">{u.email}</td>
              <td className="border px-4 py-2">{u.phoneNumber}</td>
              <td className="border px-4 py-2">{u.createdAt.slice(0, 10)}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(u)}
                  className="bg-blue-700 px-4 rounded-md text-white py-2"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit User"
      >
        {selectedUser && (
          <>
            <input
              type="text"
              defaultValue={selectedUser.userName}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, userName: e.target.value })
              }
              className="border p-2 mb-2 w-full"
            />
            <input
              type="text"
              defaultValue={selectedUser.email}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
              className="border p-2 mb-2 w-full"
            />
            <input
              type="text"
              defaultValue={selectedUser.phoneNumber}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  phoneNumber: e.target.value,
                })
              }
              className="border p-2 mb-2 w-full"
            />
            <button
              onClick={handleUpdateUser}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </>
        )}
      </Modal>
    </>
  );
}
