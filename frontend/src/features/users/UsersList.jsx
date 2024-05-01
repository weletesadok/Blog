import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
} from "./usersApiSlice";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const UsersList = () => {
  useTitle("BLog: Manage Users");
  const navigate = useNavigate();
  const handleEdit = (userId) => navigate(`/users/edit/${userId}`);
  const [message, setMessage] = useState("");

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const [
    deleteUser,
    {
      isError: isDelError,
      isSuccess: isDelSuccess,
      isLoading: isDelLoading,
      error: delError,
    },
  ] = useDeleteUserMutation();
  const [
    activateUser,
    {
      isError: isActivateError,
      isSuccess: isActivateSuccess,
      isLoading: isActivateLoading,
      error: activateError,
    },
  ] = useActivateUserMutation();
  const [
    deactivateUser,
    {
      isError: isDeactivateError,
      isSuccess: isDeactivateSuccess,
      isLoading: isDeactivateLoading,
      error: DeactivateError,
    },
  ] = useDeactivateUserMutation();

  useEffect(() => {
    if (isDelError || isActivateError || isDeactivateError) {
      setMessage("error please try again");
      console.log(message);
    } else if (isDelSuccess || isActivateSuccess || isDeactivateSuccess) {
      setMessage("success");
      navigate("/users");
    }
    return () => {
      setMessage("");
    };
  }, [
    isDelError,
    isDelSuccess,
    isActivateError,
    isActivateSuccess,
    isDeactivateError,
    isDeactivateSuccess,
  ]);

  const handleDelete = async (userId) => {
    try {
      const ress = await deleteUser({ userId });
      console.log(ress);
    } catch (error) {
      console.log(error);
    }
  };
  const handleActivate = async (userId) => {
    try {
      await activateUser({ userId });
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeactivate = async (userId) => {
    try {
      await deactivateUser({ userId });
    } catch (error) {
      console.log(error);
    }
  };

  let content;

  if (isLoading) content = <PulseLoader color={"#FFF"} />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = users;
    content = (
      <>
        <div className="container mx-auto p-8 bg-gray-400">
          <h1 className="text-3xl font-bold mb-4">Users List</h1>
          {message && <p>{message}</p>}
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-green-600">
              <thead className="bg-green-500 text-white">
                <tr>
                  <th className="px-4 py-2">Avatar</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Edit</th>
                  <th className="px-4 py-2">Delete</th>
                  <th className="px-4 py-2">Activate</th>
                  <th className="px-4 py-2">Deactivate</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {Object.values(entities).map((user) => {
                  return (
                    <tr key={user.username}>
                      <td className="border px-4 py-2">
                        <img
                          src={user.avatar}
                          alt="Avatar"
                          className="rounded-full h-10 w-10"
                        />
                      </td>
                      <td className="border px-4 py-2">{user.email}</td>
                      <td className="border px-4 py-2">
                        {user.active ? "active" : "inactive"}
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          onClick={(e) => {
                            handleEdit(user._id);
                          }}
                        >
                          Edit
                        </button>
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          onClick={(e) => {
                            handleDelete(user._id);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                          onClick={(e) => {
                            handleActivate(user._id);
                          }}
                          disabled={user.active}
                        >
                          Activate
                        </button>
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                          onClick={(e) => {
                            handleDeactivate(user._id);
                          }}
                          disabled={!user.active}
                        >
                          Deactivate
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }

  return content;
};
export default UsersList;
